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
  console.log('开始初始化地图...');
  try {
    // 检查地图容器是否存在
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) {
      console.error('地图容器不存在: #mapContainer');
      return;
    }
    console.log('地图容器尺寸:', mapContainer.offsetWidth, 'x', mapContainer.offsetHeight);
    
    // 创建地图实例
    map = new AMap.Map('mapContainer', {
      resizeEnable: true,
      zoom: 7,  // 云南省整体视图的缩放级别
      center: [102.712251, 25.040609]  // 昆明市中心坐标
    });
    
    console.log('地图实例创建成功');
    
    // 添加地图控件 - 已在地图API加载时通过插件方式添加
    map.addControl(new AMap.Scale());  // 比例尺
    console.log('添加比例尺成功');
    
    map.addControl(new AMap.ToolBar());  // 工具条
    console.log('添加工具条成功');
    
    map.addControl(new AMap.Geolocation({
      position: 'RB',  // 右下角
      offset: [10, 60]  // 偏移量
    }));  // 定位控件
    console.log('添加定位控件成功');
    
    // 确保地图能被正确渲染
    map.on('complete', function() {
      console.log('地图渲染完成');
    });
  } catch (error) {
    console.error('初始化地图时发生错误:', error);
  }
}

/**
 * 加载经销商数据
 */
function loadDealersData() {
  console.log('开始加载经销商数据...');
  fetch('./data/dealers.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('网络请求失败');
      }
      console.log('成功获取经销商数据');
      return response.json();
    })
    .then(data => {
      console.log(`成功解析经销商数据，共${data.length}条记录`);
      dealersData = data;
      
      // 确保地图已经初始化完成
      if (map && map.getStatus) {
        console.log('地图状态:', map.getStatus());
        // 在地图上添加标记
        addDealerMarkers();
        
        // 自动调整地图视野以包含所有标记
        fitMapToMarkers();
      } else {
        console.error('地图未初始化完成，无法添加标记');
        // 尝试延迟添加标记
        setTimeout(() => {
          if (map) {
            console.log('延迟添加标记...');
            addDealerMarkers();
            fitMapToMarkers();
          }
        }, 1000);
      }
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
  console.log('开始添加经销商标记...');
  
  // 确保地图对象可用
  if (!map) {
    console.error('地图对象不可用，无法添加标记');
    return;
  }
  
  // 清除现有标记
  if (markers.length > 0) {
    console.log(`清除${markers.length}个现有标记`);
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
    
    const position = [dealer.location.longitude, dealer.location.latitude];
    console.log(`添加标记: ${dealer.name}, 位置: [${position}]`);
    
    // 创建标记
    const marker = new AMap.Marker({
      position: position,
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
          <a href="javascript:void(0);" class="map-info-btn navigate" onclick="navigateToDealer('${dealer.address}')">
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
  if (markers.length > 0) {
    console.log(`将${markers.length}个标记添加到地图`);
    map.add(markers);
  } else {
    console.warn('没有可添加的标记');
  }
  
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
 * @param {string} address - 地址
 */
function navigateToDealer(address) {
  console.log(`准备导航到: 地址: ${address}`);
  
  // 直接使用高德地图URI API的search接口，让高德地图自动识别地址
  const encodedAddress = encodeURIComponent(address);
  const url = `https://uri.amap.com/search?keyword=${encodedAddress}&callnative=1&sourceApplication=茅台经销商导航`;
  
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