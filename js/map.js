/**
 * 茅台经销商地图展示
 * 主要功能：在地图上显示所有经销商位置，并提供导航和拨打电话功能
 */

// 全局变量
let map = null;
let dealersData = [];
let markers = [];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  // 初始化地图
  initMap();
  
  // 加载经销商数据
  loadDealersData();
});

/**
 * 初始化地图
 */
function initMap() {
  // 创建地图实例
  map = new AMap.Map('mapContainer', {
    resizeEnable: true,
    zoom: 7,  // 云南省整体视图的缩放级别
    center: [102.712251, 25.040609]  // 昆明市中心坐标
  });
  
  // 添加地图控件 - 已在地图API加载时通过插件方式添加
  map.addControl(new AMap.Scale());  // 比例尺
  map.addControl(new AMap.ToolBar());  // 工具条
  map.addControl(new AMap.Geolocation({
    position: 'RB',  // 右下角
    offset: [10, 60]  // 偏移量
  }));  // 定位控件
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
      
      // 在地图上添加标记
      addDealerMarkers();
      
      // 自动调整地图视野以包含所有标记
      fitMapToMarkers();
    })
    .catch(error => {
      console.error('加载数据失败:', error);
      alert('加载经销商数据失败，请刷新页面重试。');
    });
}

/**
 * 在地图上添加经销商标记
 */
function addDealerMarkers() {
  // 清除现有标记
  if (markers.length > 0) {
    map.remove(markers);
    markers = [];
  }
  
  // 添加新标记
  dealersData.forEach((dealer, index) => {
    // 确保坐标有效
    if (!dealer.location || !dealer.location.latitude || !dealer.location.longitude) {
      console.error('经销商坐标信息缺失:', dealer.name);
      return;
    }
    
    // 创建标记
    const marker = new AMap.Marker({
      position: [dealer.location.longitude, dealer.location.latitude],
      title: dealer.name,
      // 使用默认标记，添加自定义样式
      content: `<div class="custom-marker"><span>${index + 1}</span></div>`,
      offset: new AMap.Pixel(-15, -30),
      extData: {
        id: index,
        dealer: dealer
      }
    });
    
    // 创建信息窗体内容
    const infoWindowContent = `
      <div class="map-info-window">
        <div class="map-info-title">${dealer.name}</div>
        <div class="map-info-address">${dealer.address}</div>
        <div class="map-info-phone">${dealer.phone}</div>
        <div class="map-info-actions">
          <a href="javascript:void(0);" class="map-info-btn navigate" onclick="navigateToDealer(${dealer.location.latitude}, ${dealer.location.longitude}, '${dealer.address}')">
            <i class="fas fa-map-marker-alt"></i> 导航
          </a>
          <a href="tel:${dealer.phone}" class="map-info-btn call">
            <i class="fas fa-phone"></i> 拨打电话
          </a>
        </div>
      </div>
    `;
    
    // 创建信息窗体
    const infoWindow = new AMap.InfoWindow({
      content: infoWindowContent,
      offset: new AMap.Pixel(0, -30)
    });
    
    // 绑定点击事件
    marker.on('click', () => {
      infoWindow.open(map, marker.getPosition());
    });
    
    // 添加到地图
    markers.push(marker);
  });
  
  // 将所有标记添加到地图
  map.add(markers);
  
  // 打印调试信息
  console.log(`成功添加了 ${markers.length} 个经销商标记`);
}

/**
 * 自动调整地图视野以包含所有标记
 */
function fitMapToMarkers() {
  if (markers.length > 0) {
    // 获取所有标记的位置
    const positions = markers.map(marker => marker.getPosition());
    
    // 自动调整地图视野
    map.setFitView(markers);
    console.log('地图视野已调整，包含所有标记');
  }
}

/**
 * 导航到经销商位置
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @param {string} address - 地址
 */
function navigateToDealer(lat, lng, address) {
  console.log(`准备导航到: [${lng}, ${lat}], 地址: ${address}`);
  
  // 显示导航选择对话框
  if (!document.getElementById('navigationDialog')) {
    // 创建导航选择对话框
    const dialog = document.createElement('div');
    dialog.id = 'navigationDialog';
    dialog.className = 'navigation-dialog';
    dialog.innerHTML = `
      <div class="navigation-dialog-content">
        <h3>选择导航应用</h3>
        <div class="navigation-apps">
          <button class="nav-app-btn" data-type="amap" data-lat="${lat}" data-lng="${lng}" data-address="${address}">
            <i class="fas fa-map-marked-alt"></i>
            <span>高德地图</span>
          </button>
          <button class="nav-app-btn" data-type="baidu" data-lat="${lat}" data-lng="${lng}" data-address="${address}">
            <i class="fas fa-map-marked-alt"></i>
            <span>百度地图</span>
          </button>
          <button class="nav-app-btn" data-type="apple" data-lat="${lat}" data-lng="${lng}" data-address="${address}">
            <i class="fas fa-map-marked-alt"></i>
            <span>苹果地图</span>
          </button>
          <button class="nav-app-btn" data-type="tencent" data-lat="${lat}" data-lng="${lng}" data-address="${address}">
            <i class="fas fa-map-marked-alt"></i>
            <span>腾讯地图</span>
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
        const lat = e.currentTarget.getAttribute('data-lat');
        const lng = e.currentTarget.getAttribute('data-lng');
        const address = e.currentTarget.getAttribute('data-address');
        
        openNavigation(navType, lat, lng, address);
        dialog.style.display = 'none';
      });
    });
  } else {
    // 更新已存在对话框中的数据
    const dialog = document.getElementById('navigationDialog');
    const navButtons = dialog.querySelectorAll('.nav-app-btn');
    navButtons.forEach(button => {
      button.setAttribute('data-lat', lat);
      button.setAttribute('data-lng', lng);
      button.setAttribute('data-address', address);
    });
    
    // 显示已存在的对话框
    dialog.style.display = 'flex';
  }
}

/**
 * 打开导航应用
 * @param {string} type - 导航应用类型
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @param {string} address - 地址
 */
function openNavigation(type, lat, lng, address) {
  let url = '';
  
  // 添加调试日志
  console.log(`打开导航: 类型=${type}, 坐标=[${lng}, ${lat}], 地址=${address}`);
  
  switch(type) {
    case 'amap':
      // 高德地图
      url = `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(address)}&callnative=1`;
      break;
    case 'baidu':
      // 百度地图
      url = `https://api.map.baidu.com/marker?location=${lat},${lng}&title=${encodeURIComponent(address)}&content=${encodeURIComponent(address)}&output=html&src=webapp.baidu.openAPIdemo`;
      break;
    case 'apple':
      // 苹果地图
      url = `https://maps.apple.com/?q=${encodeURIComponent(address)}&ll=${lat},${lng}&z=16`;
      break;
    case 'tencent':
      // 腾讯地图
      url = `https://apis.map.qq.com/uri/v1/marker?marker=coord:${lat},${lng};title:${encodeURIComponent(address)};addr:${encodeURIComponent(address)}&referer=myapp`;
      break;
    default:
      // 默认使用高德地图
      url = `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(address)}&callnative=1`;
  }
  
  console.log(`导航URL: ${url}`);
  window.location.href = url;
} 