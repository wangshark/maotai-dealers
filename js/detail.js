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
 * 从URL获取参数
 * @param {string} name - 参数名称
 * @returns {string|null} 参数值或null
 */
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

/**
 * 显示错误信息
 * @param {string} message - 错误信息
 */
function showError(message) {
  document.getElementById('loader').style.display = 'none';
  document.getElementById('dealerDetail').innerHTML = `
    <div class="error-message">
      <p>${message}</p>
      <a href="index.html" class="btn btn-primary">返回首页</a>
    </div>
  `;
}

/**
 * 加载经销商数据
 */
function loadDealersData() {
  fetch('./data/dealers.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('网络请求失败');
      }
      return response.json();
    })
    .then(data => {
      dealersData = data;
      
      // 查找当前经销商
      const dealerId = parseInt(currentDealerId);
      const dealer = dealersData[dealerId];
      
      if (!dealer) {
        showError('未找到该经销商信息');
        return;
      }
      
      // 渲染经销商详情
      renderDealerDetail(dealer);
      
      // 初始化地图预览
      initMap(dealer);
      
      // 隐藏加载动画
      document.getElementById('loader').style.display = 'none';
    })
    .catch(error => {
      console.error('加载数据失败:', error);
      showError(`加载经销商数据失败: ${error.message}`);
    });
}

/**
 * 初始化地图
 * @param {Object} dealer - 经销商数据
 */
function initMap(dealer) {
  if (!dealer.location || !dealer.location.latitude || !dealer.location.longitude) {
    console.error('经销商坐标信息缺失:', dealer.name);
    return;
  }
  
  console.log(`初始化地图: ${dealer.name}, 坐标: [${dealer.location.longitude}, ${dealer.location.latitude}]`);
  
  // 创建地图实例
  mapInstance = new AMap.Map('mapPreview', {
    resizeEnable: true,
    zoom: 15,
    center: [dealer.location.longitude, dealer.location.latitude]
  });
  
  // 添加标记
  const marker = new AMap.Marker({
    position: [dealer.location.longitude, dealer.location.latitude],
    title: dealer.name,
    map: mapInstance
  });
  
  // 添加地图控件
  mapInstance.addControl(new AMap.Scale());
  mapInstance.addControl(new AMap.ToolBar({
    position: 'RB'
  }));
  
  // 设置地图显示层级
  mapInstance.setFitView();
}

/**
 * 从地址字符串中提取地区信息
 * @param {string} address - 地址字符串
 * @returns {string} 地区名称
 */
function getRegionFromAddress(address) {
  if (!address) return '未知地区';
  
  // 常见的云南省地区名称
  const regions = [
    '昆明市', '大理', '丽江', '西双版纳', '曲靖', '玉溪', '楚雄', 
    '红河', '文山', '普洱', '德宏', '保山', '昭通', '临沧', '怒江', '迪庆', '昆明'
  ];
  
  // 尝试从地址中提取地区
  for (const region of regions) {
    if (address.includes(region)) {
      return region;
    }
  }
  
  // 默认返回云南省
  return '云南省';
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
            ${dealer.businessHours || '09:00 - 18:00'}
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
      <a href="javascript:void(0);" class="action-button navigate" onclick="navigateToDealer(${dealerId})">
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

/**
 * 导航到经销商位置
 * @param {number} dealerId - 经销商ID
 */
function navigateToDealer(dealerId) {
  // 获取经销商数据
  const dealer = dealersData[dealerId];
  if (!dealer) {
    console.error('无法获取经销商信息');
    return;
  }
  
  // 优先使用专卖店名称（mapName）进行搜索导航，如果没有则使用地址
  const searchKeyword = dealer.mapName || dealer.address;
  console.log(`准备导航到: ${searchKeyword}`);
  
  // 直接使用高德地图URI API的search接口，让高德地图自动识别
  const encodedKeyword = encodeURIComponent(searchKeyword);
  const url = `https://uri.amap.com/search?keyword=${encodedKeyword}&callnative=1&sourceApplication=茅台经销商导航`;
  
  // 在新窗口中打开地图
  window.open(url, '_blank');
}

/**
 * 打开导航应用
 * @param {string} type - 导航应用类型
 * @param {string} address - 地址
 */
function openNavigation(type, address) {
  let url = '';
  
  // 添加调试日志
  console.log(`打开导航: 类型=${type}, 地址=${address}`);
  
  switch(type) {
    case 'amap':
      // 高德地图 - 只使用关键字搜索
      url = `https://uri.amap.com/search?keyword=${encodeURIComponent(address)}&callnative=1`;
      break;
    case 'baidu':
      // 百度地图 - 只使用地址搜索
      url = `https://api.map.baidu.com/geocoder?address=${encodeURIComponent(address)}&output=html&src=webapp.baidu.openAPIdemo`;
      break;
    case 'apple':
      // 苹果地图 - 只使用地址搜索
      url = `https://maps.apple.com/?q=${encodeURIComponent(address)}`;
      break;
    case 'tencent':
      // 腾讯地图 - 只使用地址搜索
      url = `https://apis.map.qq.com/uri/v1/search?keyword=${encodeURIComponent(address)}&referer=myapp`;
      break;
    default:
      // 默认使用高德地图
      url = `https://uri.amap.com/search?keyword=${encodeURIComponent(address)}&callnative=1`;
  }
  
  console.log(`导航URL: ${url}`);
  window.location.href = url;
}