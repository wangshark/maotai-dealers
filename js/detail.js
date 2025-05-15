/**
 * 茅台经销商详情页
 * 主要功能：根据URL参数加载经销商详情，显示地图位置，提供导航和拨打电话功能
 */

// 全局变量
let dealersData = [];
let currentDealerId = null;
let mapInstance = null;
let favorites = [];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  // 显示加载动画
  document.getElementById('loader').style.display = 'block';
  
  // 获取URL参数中的经销商ID
  currentDealerId = getUrlParameter('id');
  
  if (currentDealerId === null) {
    // 没有找到ID参数，显示错误信息
    showError('未找到经销商信息');
    return;
  }
  
  // 加载收藏数据
  loadFavorites();
  
  // 加载经销商数据
  loadDealersData();
});

/**
 * 加载收藏数据
 */
function loadFavorites() {
  const savedFavorites = localStorage.getItem('maotai_favorites');
  if (savedFavorites) {
    favorites = JSON.parse(savedFavorites);
  }
}

/**
 * 保存收藏数据
 */
function saveFavorites() {
  localStorage.setItem('maotai_favorites', JSON.stringify(favorites));
}

/**
 * 切换收藏状态
 */
function toggleFavorite() {
  const favoriteBtn = document.getElementById('favoriteBtn');
  const dealerId = parseInt(currentDealerId);
  const favoriteIndex = favorites.indexOf(dealerId);
  
  if (favoriteIndex === -1) {
    // 添加到收藏
    favorites.push(dealerId);
    favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> 已收藏';
    favoriteBtn.classList.add('active');
  } else {
    // 从收藏中移除
    favorites.splice(favoriteIndex, 1);
    favoriteBtn.innerHTML = '<i class="far fa-heart"></i> 收藏';
    favoriteBtn.classList.remove('active');
  }
  
  // 保存收藏数据
  saveFavorites();
}

/**
 * 渲染经销商详情
 * @param {Object} dealer - 经销商数据
 */
function renderDealerDetail(dealer) {
  const dealerDetailElement = document.getElementById('dealerDetail');
  
  // 获取地区信息
  const region = getRegionFromAddress(dealer.address);
  
  // 检查是否已收藏
  const dealerId = parseInt(currentDealerId);
  const isFavorite = favorites.includes(dealerId);
  const favoriteIconClass = isFavorite ? 'fas' : 'far';
  const favoriteText = isFavorite ? '已收藏' : '收藏';
  const favoriteClass = isFavorite ? 'active' : '';
  
  // 创建详情内容
  dealerDetailElement.innerHTML = `
    <div class="dealer-header">
      <div class="dealer-avatar">
        <i class="fas fa-store"></i>
      </div>
      <div class="dealer-title">
        <div class="dealer-name">${dealer.name}</div>
        <div class="dealer-type">茅台专卖店</div>
      </div>
    </div>
    
    <ul class="dealer-info-list">
      <li class="dealer-info-item">
        <div class="dealer-info-icon">
          <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="dealer-info-content">
          <div class="dealer-info-label">地址</div>
          <div class="dealer-info-value">${dealer.address}</div>
        </div>
      </li>
      
      <li class="dealer-info-item">
        <div class="dealer-info-icon">
          <i class="fas fa-phone"></i>
        </div>
        <div class="dealer-info-content">
          <div class="dealer-info-label">联系电话</div>
          <div class="dealer-info-value">${dealer.phone}</div>
        </div>
      </li>
      
      <li class="dealer-info-item">
        <div class="dealer-info-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="dealer-info-content">
          <div class="dealer-info-label">营业时间</div>
          <div class="dealer-info-value">
            <div class="business-hours">
              <div class="business-day">
                <span class="day-name">周一至周五</span>
                <span class="day-hours">09:00 - 18:00</span>
              </div>
              <div class="business-day">
                <span class="day-name">周六至周日</span>
                <span class="day-hours">10:00 - 17:00</span>
              </div>
            </div>
          </div>
        </div>
      </li>
      
      <li class="dealer-info-item">
        <div class="dealer-info-icon">
          <i class="fas fa-map"></i>
        </div>
        <div class="dealer-info-content">
          <div class="dealer-info-label">所在地区</div>
          <div class="dealer-info-value">${region}</div>
        </div>
      </li>
    </ul>
    
    <div class="action-buttons">
      <a href="javascript:void(0);" class="action-button navigate" onclick="navigateToDealer(${dealer.location.latitude}, ${dealer.location.longitude}, '${dealer.address}')">
        <i class="fas fa-map-marker-alt"></i> 导航到这里
      </a>
      <a href="tel:${dealer.phone}" class="action-button call">
        <i class="fas fa-phone"></i> 拨打电话
      </a>
    </div>
    
    <button id="favoriteBtn" class="favorite-button ${favoriteClass}" onclick="toggleFavorite()">
      <i class="${favoriteIconClass} fa-heart"></i> ${favoriteText}
    </button>
  `;
  
  // 更新页面标题
  document.title = `${dealer.name} - 贵州茅台云南省经销商名录`;
  
  // 添加到浏览历史
  addToHistory(dealerId);
}

/**
 * 添加到浏览历史
 * @param {number} dealerId - 经销商ID
 */
function addToHistory(dealerId) {
  // 从localStorage获取历史记录
  let history = localStorage.getItem('maotai_history');
  let historyArray = history ? JSON.parse(history) : [];
  
  // 如果已存在该ID，先移除
  const index = historyArray.indexOf(dealerId);
  if (index !== -1) {
    historyArray.splice(index, 1);
  }
  
  // 添加到历史记录开头
  historyArray.unshift(dealerId);
  
  // 限制历史记录数量，最多保存10条
  if (historyArray.length > 10) {
    historyArray = historyArray.slice(0, 10);
  }
  
  // 保存到localStorage
  localStorage.setItem('maotai_history', JSON.stringify(historyArray));
}