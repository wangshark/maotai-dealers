/**
 * 茅台经销商信息展示系统
 * 主要功能：加载经销商数据，渲染页面，处理导航和拨打电话功能
 */

// 全局变量
let dealersData = [];
let currentFilter = 'all';
let searchTimeout;
let favorites = [];
let history = [];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  // 显示加载动画
  document.getElementById('loader').style.display = 'block';
  
  // 加载经销商数据
  loadDealersData();
  
  // 初始化搜索功能
  initSearchFunction();
  
  // 初始化筛选标签功能
  initFilterTabs();
  
  // 加载收藏数据
  loadFavorites();
  
  // 加载浏览历史
  loadHistory();
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
 * @param {number} index - 经销商索引
 * @param {Event} event - 事件对象
 */
function toggleFavorite(index, event) {
  // 阻止事件冒泡，避免触发列表项点击事件
  event.stopPropagation();
  
  const favoriteIndex = favorites.indexOf(index);
  
  if (favoriteIndex === -1) {
    // 添加到收藏
    favorites.push(index);
    event.target.classList.remove('far');
    event.target.classList.add('fas');
    event.target.style.color = '#a81c07';
  } else {
    // 从收藏中移除
    favorites.splice(favoriteIndex, 1);
    event.target.classList.remove('fas');
    event.target.classList.add('far');
    event.target.style.color = '#666666';
  }
  
  // 保存收藏数据
  saveFavorites();
}

/**
 * 初始化搜索功能
 */
function initSearchFunction() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    // 监听输入事件，实现实时搜索
    searchInput.addEventListener('input', (e) => {
      // 清除之前的定时器
      clearTimeout(searchTimeout);
      
      // 设置新的定时器，延迟300ms执行搜索
      // 这样可以避免用户快速输入时频繁搜索
      searchTimeout = setTimeout(() => {
        searchDealers();
      }, 300);
    });
    
    // 监听回车键
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        searchDealers();
      }
    });
  }
}

/**
 * 初始化筛选标签功能
 */
function initFilterTabs() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  if (filterTabs.length > 0) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // 移除所有标签的active类
        filterTabs.forEach(t => t.classList.remove('active'));
        
        // 为当前标签添加active类
        tab.classList.add('active');
        
        // 获取筛选区域
        currentFilter = tab.getAttribute('data-region');
        
        // 筛选并渲染经销商列表
        filterAndRenderDealers();
      });
    });
  }
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
      renderDealersList(dealersData);
      
      // 隐藏加载动画
      document.getElementById('loader').style.display = 'none';
    })
    .catch(error => {
      console.error('加载数据失败:', error);
      document.getElementById('dealersList').innerHTML = `
        <div class="error-message">
          <p>加载经销商数据失败，请刷新页面重试。</p>
          <p>错误详情: ${error.message}</p>
        </div>
      `;
      
      // 隐藏加载动画
      document.getElementById('loader').style.display = 'none';
    });
}

/**
 * 筛选并渲染经销商列表
 */
function filterAndRenderDealers() {
  if (currentFilter === 'all') {
    renderDealersList(dealersData);
    return;
  }
  
  // 处理"我的收藏"筛选
  if (currentFilter === 'favorites') {
    if (favorites.length === 0) {
      // 如果没有收藏的经销商，显示提示信息
      const dealersListElement = document.getElementById('dealersList');
      dealersListElement.innerHTML = '<p class="no-data">您还没有收藏任何经销商</p>';
      return;
    }
    
    // 根据收藏的索引筛选经销商
    const favoriteDealers = dealersData.filter((dealer, index) => {
      return favorites.includes(index);
    });
    
    renderDealersList(favoriteDealers);
    return;
  }
  
  // 处理"浏览历史"筛选
  if (currentFilter === 'history') {
    if (history.length === 0) {
      // 如果没有浏览历史，显示提示信息
      const dealersListElement = document.getElementById('dealersList');
      dealersListElement.innerHTML = '<p class="no-data">您还没有浏览任何经销商</p>';
      return;
    }
    
    // 根据历史记录的索引筛选经销商
    const historyDealers = [];
    history.forEach(index => {
      if (dealersData[index]) {
        historyDealers.push(dealersData[index]);
      }
    });
    
    renderDealersList(historyDealers);
    return;
  }
  
  // 按地区筛选
  const filteredDealers = dealersData.filter(dealer => {
    return dealer.address.includes(currentFilter);
  });
  
  renderDealersList(filteredDealers);
}

/**
 * 渲染经销商列表
 * @param {Array} dealers - 经销商数据数组
 */
function renderDealersList(dealers) {
  const dealersListElement = document.getElementById('dealersList');
  
  // 清空列表
  dealersListElement.innerHTML = '';
  
  // 处理没有数据的情况
  if (!dealers || dealers.length === 0) {
    dealersListElement.innerHTML = '<p class="no-data">暂无经销商数据</p>';
    return;
  }
  
  // 创建列表元素
  dealers.forEach((dealer, index) => {
    const dealerItem = document.createElement('li');
    dealerItem.className = 'dealer-list-item';
    
    // 序号从1开始
    const displayIndex = index + 1;
    const formattedIndex = displayIndex < 10 ? `0${displayIndex}` : displayIndex;
    
    // 检查是否已收藏
    const isFavorite = favorites.includes(index);
    const favoriteIconClass = isFavorite ? 'fas' : 'far';
    const favoriteIconColor = isFavorite ? '#a81c07' : '#666666';
    
    dealerItem.innerHTML = `
      <div class="dealer-content">
        <div class="dealer-name">
          ${dealer.name}
          <i class="${favoriteIconClass} fa-heart favorite-icon" style="color: ${favoriteIconColor}" onclick="toggleFavorite(${index}, event)"></i>
        </div>
        <div class="dealer-address">${dealer.address}</div>
        ${dealer.businessHours ? `<div class="dealer-hours">${dealer.businessHours}</div>` : ''}
        <div class="dealer-phone">${dealer.phone}</div>
        ${dealer.mapName ? `<div class="dealer-map-name">${dealer.mapName}</div>` : ''}
      </div>
      <div class="dealer-actions">
        <a href="javascript:void(0);" class="action-icon navigate" onclick="showMapWithNavigateButton('${dealer.mapName || dealer.address}', ${index})">
          <i class="fas fa-map-marker-alt"></i>
        </a>
        <a href="tel:${dealer.phone}" class="action-icon call">
          <i class="fas fa-phone"></i>
        </a>
      </div>
    `;
    
    // 添加点击事件，跳转到详情页
    dealerItem.addEventListener('click', (e) => {
      // 如果点击的是导航或拨打电话按钮，则不跳转到详情页
      if (e.target.closest('.action-icon') || e.target.closest('.favorite-icon')) {
        return;
      }
      // 跳转到详情页，并传递经销商ID
      window.location.href = `detail.html?id=${index}`;
    });
    
    dealersListElement.appendChild(dealerItem);
  });
}

/**
 * 显示地图位置和立即导航按钮
 * @param {string} poiName - 地图上的POI名称
 * @param {number} index - 经销商索引
 */
function showMapWithNavigateButton(poiName, index) {
  // 获取经销商数据
  const dealer = dealersData[index];
  if (!dealer) {
    console.error('无法获取经销商信息');
    return;
  }
  
  // 优先使用地址进行搜索导航（更可靠，高德会自动识别）
  const address = dealer.address;
  const encodedAddress = encodeURIComponent(address);
  
  // 使用search接口，高德地图会自动搜索定位
  const url = `https://uri.amap.com/search?keyword=${encodedAddress}&callnative=1&sourceApplication=茅台经销商导航`;
  
  // 在新窗口中打开高德地图
  window.open(url, '_blank');
}

/**
 * 导航到经销商位置
 * @param {string} poiName - 地图上的POI名称
 */
function navigateToDealer(poiName) {
  // 直接打开高德地图显示位置
  const encodedPoiName = encodeURIComponent(poiName);
  const url = `https://uri.amap.com/search?keyword=${encodedPoiName}&callnative=1`;
  window.location.href = url;
}

/**
 * 显示导航选择对话框
 * @param {string} poiName - 地图上的POI名称
 */
function showNavigationOptions(poiName) {
  // 如果已经存在导航对话框，先移除它
  const existingDialog = document.getElementById('navigationDialog');
  if (existingDialog) {
    existingDialog.remove();
  }
  
  // 创建新的导航选择对话框
  const dialog = document.createElement('div');
  dialog.id = 'navigationDialog';
  dialog.className = 'navigation-dialog';
  dialog.innerHTML = `
    <div class="navigation-dialog-content">
      <h3>选择导航应用</h3>
      <div class="navigation-apps">
        <button class="nav-app-btn" data-type="amap">
          <i class="fas fa-map-marked-alt"></i>
          <span>高德地图</span>
        </button>
        <button class="nav-app-btn" data-type="baidu">
          <i class="fas fa-map-marked-alt"></i>
          <span>百度地图</span>
        </button>
        <button class="nav-app-btn" data-type="apple">
          <i class="fas fa-map-marked-alt"></i>
          <span>苹果地图</span>
        </button>
      </div>
      <button class="nav-cancel-btn">取消</button>
    </div>
  `;
  document.body.appendChild(dialog);
  
  // 添加点击事件
  dialog.querySelector('.nav-cancel-btn').addEventListener('click', () => {
    dialog.style.display = 'none';
  });
  
  // 为每个导航应用按钮添加点击事件
  const navAppButtons = dialog.querySelectorAll('.nav-app-btn');
  navAppButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const navType = e.currentTarget.getAttribute('data-type');
      openNavigation(navType, poiName);
      dialog.style.display = 'none';
    });
  });
  
  // 显示对话框
  dialog.style.display = 'flex';
}

/**
 * 打开导航应用
 * @param {string} type - 导航应用类型
 * @param {string} poiName - 地图上的POI名称
 */
function openNavigation(type, poiName) {
  let url = '';
  
  // 对POI名称进行编码，确保URL安全
  const encodedPoiName = encodeURIComponent(poiName);
  
  switch(type) {
    case 'amap':
      // 高德地图 - 使用POI搜索
      url = `https://uri.amap.com/search?keyword=${encodedPoiName}&callnative=1`;
      break;
    case 'baidu':
      // 百度地图 - 使用POI搜索
      url = `https://api.map.baidu.com/place/search?query=${encodedPoiName}&region=全国&output=html&src=webapp.baidu.openAPIdemo`;
      break;
    case 'apple':
      // 苹果地图 - 使用POI搜索
      url = `https://maps.apple.com/?q=${encodedPoiName}`;
      break;
    default:
      // 默认使用高德地图
      url = `https://uri.amap.com/search?keyword=${encodedPoiName}&callnative=1`;
  }
  
  window.location.href = url;
}

/**
 * 搜索经销商
 */
function searchDealers() {
  const searchInput = document.getElementById('searchInput');
  const keyword = searchInput.value.trim().toLowerCase();
  
  if (!keyword) {
    // 如果搜索框为空，显示所有经销商
    filterAndRenderDealers();
    return;
  }
  
  // 过滤经销商数据
  const filteredDealers = dealersData.filter(dealer => {
    return dealer.name.toLowerCase().includes(keyword) || 
           dealer.address.toLowerCase().includes(keyword);
  });

  // 对搜索结果进行排序，优先显示名称匹配的结果
  const sortedDealers = filteredDealers.sort((a, b) => {
    const aNameMatch = a.name.toLowerCase().includes(keyword);
    const bNameMatch = b.name.toLowerCase().includes(keyword);
    
    // 如果a的名称匹配而b不匹配，a排在前面
    if (aNameMatch && !bNameMatch) return -1;
    // 如果b的名称匹配而a不匹配，b排在前面
    if (!aNameMatch && bNameMatch) return 1;
    
    // 如果都匹配或都不匹配，按名称字母顺序排序
    return a.name.localeCompare(b.name);
  });
  
  // 渲染排序后的经销商列表
  renderDealersList(sortedDealers);
  
  // 显示搜索结果数量
  const resultCount = sortedDealers.length;
  const dealersListElement = document.getElementById('dealersList');
  
  if (resultCount > 0) {
    // 在列表前添加搜索结果数量提示
    const resultInfo = document.createElement('div');
    resultInfo.className = 'search-result-info';
    resultInfo.textContent = `找到 ${resultCount} 家符合"${keyword}"的经销商`;
    dealersListElement.insertBefore(resultInfo, dealersListElement.firstChild);
  }
}

/**
 * 加载浏览历史
 */
function loadHistory() {
  const savedHistory = localStorage.getItem('maotai_history');
  if (savedHistory) {
    history = JSON.parse(savedHistory);
  }
} 