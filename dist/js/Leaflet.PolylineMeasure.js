!function(e){if("function"==typeof define&&define.amd)define(["leaflet"],e);else if("undefined"!=typeof module)module.exports=e(require("leaflet"));else{if("undefined"==typeof window.L)throw new Error("Leaflet must be loaded first");e(window.L)}}(function(e){var o="polyline-measure-control",i="polyline-measure-unicode-icon";e.Control.PolylineMeasure=e.Control.extend({includes:e.Mixin.Events,options:{position:"topleft",imperial:!1,measureControlTitle:"",measureControlLabel:"&#8614;",measureControlClasses:[],backgroundColor:"#8f8",cursor:"crosshair",clearMeasurementsOnStop:!0,showMeasurementsClearControl:!1,clearControlTitle:"Clear",clearControlLabel:"&times;",clearControlClasses:[],tempLine:{color:"#00f",weight:2},fixedLine:{color:"#006",weight:2},startCircle:{color:"#000",weight:1,fillColor:"#0f0",fillOpacity:1,radius:3},intermedCircle:{color:"#000",weight:1,fillColor:"#ff0",fillOpacity:1,radius:3},currentCircle:{color:"#000",weight:1,fillColor:"#f0f",fillOpacity:1,radius:3},endCircle:{color:"#000",weight:1,fillColor:"#f00",fillOpacity:1,radius:3}},onAdd:function(t){var r=this;r._container=document.createElement("div"),r._container.classList.add("leaflet-bar"),e.DomEvent.disableClickPropagation(r._container);var n=r.options.measureControlTitle?r.options.measureControlTitle:"Polyline Measure "+(r.options.imperial?"[imperial]":"[metric]"),l=r.options.measureControlLabel,a=r.options.measureControlClasses;return l.indexOf("&")!==-1&&a.push(i),r._measureControl=r._createControl(l,n,a,r._container,r._toggleMeasure,r),r._measureControl.setAttribute("id",o),r.options.showMeasurementsClearControl&&(n=r.options.clearControlTitle,l=r.options.clearControlLabel,a=r.options.clearControlClasses,l.indexOf("&")!==-1&&a.push(i),r._clearMeasureControl=r._createControl(l,n,a,r._container,r._clearAllMeasurements,r),r._clearMeasureControl.classList.add("polyline-measure-clearControl")),r._container},onRemove:function(){this._disableMeasure()},_createControl:function(o,i,t,r,n,l){var a=document.createElement("a");return a.innerHTML=o,a.setAttribute("title",i),t.forEach(function(e){a.classList.add(e)}),e.DomEvent.on(a,"click",n,l),r.appendChild(a),a},_toggleMeasure:function(){this._measuring?this._disableMeasure():this._enableMeasure(),this.fire("toggle",{status:this._measuring})},_enableMeasure:function(){if(!this._measuring){var o=this;o._measuring=!0,o._measureControl.style.backgroundColor=o.options.backgroundColor,o._oldCursor=o._map._container.style.cursor,o._map._container.style.cursor=o.options.cursor,o._doubleClickZoom=o._map.doubleClickZoom.enabled(),o._map.doubleClickZoom.disable(),o._map.on("mousemove",o._mouseMove,o),o._map.on("click",o._mouseClick,o),e.DomEvent.on(document,"keydown",o._onKeyDown,o),o._layerPaint||(o._layerPaint=e.layerGroup().addTo(o._map)),o._cntLine||(o._cntLine=0,o._arrFixedLines=[],o._arrTooltips=[]),o._resetPathVariables(),o.fire("enable")}},_disableMeasure:function(){if(this._measuring){var o=this;o._measuring=!1,o._measureControl.removeAttribute("style"),o._map._container.style.cursor=o._oldCursor,o._map.off("mousemove",o._mouseMove,o),o._map.off("click",o._mouseClick,o),e.DomEvent.off(document,"keydown",o._onKeyDown,o),o._doubleClickZoom&&o._map.doubleClickZoom.enable(),o.options.clearMeasurementsOnStop&&o._layerPaint&&o._clearAllMeasurements(),0!==o._cntCircle&&o._finishPath(),o.fire("disable")}},_clearAllMeasurements:function(){var e=this;0!==e._cntCircle&&e._finishPath(),e._layerPaint&&e._layerPaint.clearLayers(),e._cntLine=0,e._arrFixedLines=[],e._arrTooltips=[]},_onKeyDown:function(e){var o=this;27===e.keyCode&&(o._currentCircle?o._finishPath(e):o._toggleMeasure())},_getDistance:function(e){var o,i=this,t=e;return i.options.imperial===!0?(o="mi",t>=1609344?t=(t/1609.344).toFixed(0):t>=160934.4?t=(t/1609.344).toFixed(1):t>=1609.344?t=(t/1609.344).toFixed(2):(t=(t/.9144).toFixed(1),o="yd")):(o="km",t>=1e6?t=(t/1e3).toFixed(0):t>=1e5?t=(t/1e3).toFixed(1):t>=1e3?t=(t/1e3).toFixed(2):(t=t.toFixed(1),o="m")),{value:t,unit:o}},_updateTooltipDistance:function(e,o){var i=this,t=i._getDistance(e),r=i._getDistance(o),n='<div class="polyline-measure-tooltip-total">'+t.value+"&nbsp;"+t.unit+"</div>";r.value>0&&(n+='<div class="polyline-measure-tooltip-difference">(+'+r.value+"&nbsp;"+r.unit+")</div>"),i._tooltip._icon.innerHTML=n},_mouseMove:function(e){var o=this;if(o._map.on("click",o._mouseClick,o),e.latlng&&o._currentCircle){o._tempLine.setLatLngs([o._currentCircleCoords,e.latlng]),o._tooltip.setLatLng(e.latlng);var i=e.latlng.distanceTo(o._currentCircleCoords);o._updateTooltipDistance(o._distance+i,i),o.fire("move",{length:i,distance:o._distance+i})}},_mouseClick:function(o){var i=this;if(o.latlng){if(i._tempLine||(i._tempLine=e.polyline([],{color:i.options.tempLine.color,weight:i.options.tempLine.weight,interactive:!1,dashArray:"8,8"}).addTo(i._layerPaint).bringToBack(),i.fire("start")),i._currentCircle){i._tooltip.setLatLng(o.latlng);var t=o.latlng.distanceTo(i._currentCircleCoords);i._updateTooltipDistance(i._distance+t,t),i._arrTooltipsCurrentline.push(i._tooltip),i._distance+=t,i._currentCircle.off("click",i._finishPath,i);var r=i.options.intermedCircle;1===i._cntCircle&&(r=i.options.startCircle,i._fixedLine=e.polyline([i._currentCircleCoords],{color:i.options.fixedLine.color,weight:i.options.fixedLine.weight,interactive:!1}).addTo(i._layerPaint).bringToBack()),i._currentCircle.setStyle({color:r.color,weight:r.weight,fillColor:r.fillColor,fillOpacity:r.fillOpacity,radius:r.radius}),i._currentCircle.on("mousedown",i._dragCircle,i),i.fire("path",{distance:i._distance,length:t})}i._prevTooltip=i._tooltip;var n=e.divIcon({className:"polyline-measure-tooltip",iconAnchor:[-4,-4]});i._tooltip=e.marker(o.latlng,{icon:n,interactive:!1}).addTo(i._layerPaint),i._fixedLine&&i._fixedLine.addLatLng(o.latlng),i._currentCircle=new e.CircleMarker(o.latlng,{color:i.options.currentCircle.color,weight:i.options.currentCircle.weight,fillColor:i.options.currentCircle.fillColor,fillOpacity:i.options.currentCircle.fillOpacity,radius:i.options.currentCircle.radius}).addTo(i._layerPaint),i._currentCircle.cntLine=i._cntLine,i._currentCircle.cntCircle=i._cntCircle,i._cntCircle++,i._currentCircle.on("click",i._finishPath,i),i._currentCircleCoords=o.latlng}},_finishPath:function(o){var i=this;o&&e.DomEvent.stopPropagation(o),i._currentCircle.off("click",i._finishPath,i),1!==i._cntCircle?(i._prevTooltip._icon.classList.add("polyline-measure-tooltip-end"),i._currentCircle.setStyle({color:i.options.endCircle.color,weight:i.options.endCircle.weight,fillColor:i.options.endCircle.fillColor,fillOpacity:i.options.endCircle.fillOpacity,radius:i.options.endCircle.radius}),i._arrFixedLines.push(i._fixedLine),i._cntLine++,i._arrTooltips.push(i._arrTooltipsCurrentline),i._currentCircle.on("mousedown",i._dragCircle,i)):i._layerPaint.removeLayer(i._currentCircle),i._layerPaint.removeLayer(i._tooltip),i._layerPaint.removeLayer(i._tempLine),i.fire("stop",{distance:i._distance}),i._resetPathVariables()},_resetPathVariables:function(){var e=this;e._cntCircle=0,e._distance=0,e._tooltip=void 0,e._currentCircle=void 0,e._currentCircleCoords=void 0,e._fixedLine=void 0,e._tempLine=void 0,e._arrTooltipsCurrentline=[null]},_dragCircle:function(o){var i=this;if(i._measuring&&0===i._cntCircle){i._map.dragging.disable(),i._map.off("mousemove",i._mouseMove,i),i._map.off("click",i._mouseClick,i);var t=o.latlng.lat,r=o.latlng.lng,n=o.target._latlng.lat,l=o.target._latlng.lng;i._map.on("mousemove",function(a){var s=a.latlng.lat,c=a.latlng.lng,_=s-t,u=c-r,d=e.latLng(n+_,l+u);o.target.setLatLng(d);var p=o.target.cntLine,C=o.target.cntCircle,m=i._arrFixedLines[p].getLatLngs();m[C]=d,i._arrFixedLines[p].setLatLngs(m),C>=1&&(i._tooltip=i._arrTooltips[p][C],i._tooltip.setLatLng(d)),i._distance=0,m.map(function(e,o){if(o>=1){i._tooltip=i._arrTooltips[p][o];var t=m[o].distanceTo(m[o-1]);i._updateTooltipDistance(i._distance+t,t),i._distance+=t}}),i._map.on("mouseup",function(){i._resetPathVariables(),i._map.off("mousemove"),i._map.dragging.enable(),i._map.on("mousemove",i._mouseMove,i),i._map.off("mouseup")})})}}}),e.Map.mergeOptions({PolylineMeasureControl:!1}),e.Map.addInitHook(function(){var o=this;o.options.polylineMeasureControl&&(o.PMControl=new e.Control.PolylineMeasure,o.addControl(o.PMControl))}),e.control.polylineMeasure=function(o){return new e.Control.PolylineMeasure(o)}});