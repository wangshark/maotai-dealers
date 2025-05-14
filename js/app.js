/**
 * 茅台经销商信息展示系统
 * 主要功能：加载经销商数据，渲染页面，处理导航和拨打电话功能
 */

// 全局变量
let dealersData = [];
let currentFilter = 'all';

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  // 显示加载动画
  document.getElementById('loader').style.display = 'block';
  
  // 加载经销商数据
  loadDealersData();
  
  // 更新状态栏时间
  updateStatusBarTime();
  setInterval(updateStatusBarTime, 60000); // 每分钟更新一次
  
  // 初始化搜索功能
  initSearchFunction();
  
  // 初始化筛选标签功能
  initFilterTabs();
});

/**
 * 更新状态栏时间
 */
function updateStatusBarTime() {
  const timeElement = document.querySelector('.status-bar-time');
  if (timeElement) {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    
    // 格式化时间为两位数
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    timeElement.textContent = `${hours}:${minutes}`;
  }
}

/**
 * 初始化搜索功能
 */
function initSearchFunction() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
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
    
    dealerItem.innerHTML = `
      <div class="dealer-index">${formattedIndex}</div>
      <div class="dealer-content">
        <div class="dealer-name">${dealer.name}</div>
        <div class="dealer-address">${dealer.address}</div>
        <div class="dealer-phone">${dealer.phone}</div>
      </div>
      <div class="dealer-actions">
        <a href="javascript:void(0);" class="action-icon navigate" onclick="navigateToDealer(${dealer.location.latitude}, ${dealer.location.longitude}, '${dealer.address}')">
          <i class="fas fa-map-marker-alt"></i>
        </a>
        <a href="tel:${dealer.phone}" class="action-icon call">
          <i class="fas fa-phone"></i>
        </a>
      </div>
    `;
    
    dealersListElement.appendChild(dealerItem);
  });
}

/**
 * 导航到经销商位置
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @param {string} address - 地址
 */
function navigateToDealer(lat, lng, address) {
  // 检测设备类型
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // iOS设备
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    window.location.href = `https://maps.apple.com/?q=${address}&ll=${lat},${lng}&z=16`;
    return;
  }
  
  // Android设备
  if (/android/i.test(userAgent)) {
    window.location.href = `geo:${lat},${lng}?q=${address}`;
    return;
  }
  
  // 默认使用高德地图（网页版）
  window.location.href = `https://uri.amap.com/marker?position=${lng},${lat}&name=${address}&callnative=0`;
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
  
  // 渲染过滤后的经销商列表
  renderDealersList(filteredDealers);
} 