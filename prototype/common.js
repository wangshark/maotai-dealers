/**
 * 茅台经销商信息展示系统 - 公共JavaScript功能
 */

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  // 更新状态栏时间
  updateStatusBarTime();
  setInterval(updateStatusBarTime, 60000); // 每分钟更新一次
  
  // 初始化底部导航栏激活状态
  initActiveTab();
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
 * 初始化底部导航栏的活跃标签
 */
function initActiveTab() {
  const currentPage = window.location.pathname.split('/').pop();
  const tabItems = document.querySelectorAll('.tab-item');
  
  tabItems.forEach(tab => {
    const tabHref = tab.getAttribute('href');
    if (tabHref === currentPage || 
        (currentPage === 'home.html' && tabHref === '#home') || 
        (currentPage === 'search.html' && tabHref === '#search') || 
        (currentPage === 'detail.html' && tabHref === '#detail') || 
        (currentPage === 'about.html' && tabHref === '#about')) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
}

/**
 * 模拟导航到经销商位置
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @param {string} address - 地址
 */
function navigateToDealer(lat, lng, address) {
  alert(`正在导航到: ${address}\n坐标: ${lat}, ${lng}`);
}

/**
 * 模拟拨打电话
 * @param {string} phone - 电话号码
 */
function callDealer(phone) {
  alert(`正在拨打电话: ${phone}`);
}

/**
 * 加载经销商数据
 * @returns {Promise<Array>} 经销商数据数组
 */
async function loadDealersData() {
  // 在原型中，我们硬编码一些示例数据
  return [
    {
      id: 1,
      name: "昆明市五华区茅台专卖店",
      address: "云南省昆明市五华区人民中路17号",
      phone: "0871-63612345",
      location: {
        latitude: 25.042609,
        longitude: 102.704206
      },
      openingHours: "周一至周日 9:00-21:00",
      distance: "1.2公里"
    },
    {
      id: 2,
      name: "昆明市盘龙区茅台经销商",
      address: "云南省昆明市盘龙区北京路289号",
      phone: "0871-65982345",
      location: {
        latitude: 25.052123,
        longitude: 102.72698
      },
      openingHours: "周一至周日 9:30-20:30",
      distance: "3.5公里"
    },
    {
      id: 3,
      name: "大理白族自治州茅台专卖店",
      address: "云南省大理白族自治州大理市下关镇人民路45号",
      phone: "0872-21234567",
      location: {
        latitude: 25.592765,
        longitude: 100.267958
      },
      openingHours: "周一至周日 9:00-20:00",
      distance: "318公里"
    },
    {
      id: 4,
      name: "丽江市古城区茅台经销商",
      address: "云南省丽江市古城区七一街124号",
      phone: "0888-51234567",
      location: {
        latitude: 26.872108,
        longitude: 100.234563
      },
      openingHours: "周一至周日 9:00-21:30",
      distance: "430公里"
    },
    {
      id: 5,
      name: "西双版纳傣族自治州茅台专卖店",
      address: "云南省西双版纳傣族自治州景洪市允景洪大街56号",
      phone: "0691-21234567",
      location: {
        latitude: 22.009266,
        longitude: 100.797941
      },
      openingHours: "周一至周日 9:30-20:00",
      distance: "528公里"
    }
  ];
}

/**
 * 搜索经销商
 * @param {Array} dealers - 经销商数据数组
 * @param {string} keyword - 搜索关键词
 * @returns {Array} 过滤后的经销商数组
 */
function searchDealers(dealers, keyword) {
  if (!keyword) {
    return dealers;
  }
  
  const lowercasedKeyword = keyword.toLowerCase();
  return dealers.filter(dealer => {
    return dealer.name.toLowerCase().includes(lowercasedKeyword) || 
           dealer.address.toLowerCase().includes(lowercasedKeyword);
  });
}

/**
 * 获取URL参数
 * @param {string} param - 参数名
 * @returns {string|null} 参数值
 */
function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * 以动画方式显示加载器
 * @param {boolean} show - 是否显示加载器
 */
function toggleLoader(show) {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.display = show ? 'flex' : 'none';
  }
} 