/**
 * 公共业务JS
 */
;(function($,Biz){
	// 配置项
	Biz.options = {
	};
	Biz.ready = function(){
		Biz._init(); // 自身初始化
		if(typeof Biz.commonInit == 'function'){
			Biz.commonInit();
		}
		if(typeof Biz.init == 'function'){
			Biz.init();
		}
	};
	// 子对象初始化（可覆盖）
	Biz.init = function(){
	};
	// 公共初始化
	Biz.commonInit = function(){
		this._initEles();
		this._bindEvent();
	};
	// 自身初始化
	Biz._init = function(){
	};
	// 初始化元素
	Biz._initEles = function(){
		this.messageEle = document.querySelector("#message");
		this.sendBtnEle = document.querySelector("#sendBtn");
		this._initNativeObj();
	};
	Biz._initNativeObj = function(){
		/*以下代码会造成   调用如：plus.gallery.pick,plus.camera.getCamera().captureImage等API时，
		 出现Uncaught RangeError:Maximum call stack size exceeded. 最终导致应用卡死*/
		/*this.nativeObj = {};
		if (mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var Context = plus.android.importClass("android.content.Context");
			this.nativeObj.InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
			this.nativeObj.imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
//			this.nativeObj.imm.toggleSoftInput(0, this.nativeObj.InputMethodManager.SHOW_FORCED);
		} else { 
			this.nativeObj.nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
//			this.nativeObj.nativeWebview.plusCallMethod({
//				"setKeyboardDisplayRequiresUserAction": false
//			});
		}*/
	};
	Biz.showMessage = function(msg,type){
		var classes,messageEle;
		if(typeof this.getElementBySelector == 'function'){
			messageEle = this.getElementBySelector(this.eles.messageEle);
		}else{
			messageEle = this.messageEle;
		}
		classes = messageEle.parentNode.classList;
		if(type == 'success'){
			classes.remove('error');
			classes.remove('info');
			classes.add('success');
		}else if( type == 'error'){
			classes.remove('success');
			classes.remove('info');
			classes.add('error');
		}else{
			classes.remove('success');
			classes.remove('error');
			classes.add('info');
		}
		messageEle.innerHTML = type == 'clear' ? '' : msg;
	};
	Biz.getServerErrorMsg = function(xhr){
		if(!xhr){
			return '';
		}
		switch (xhr.status){
			case 0 :
				return '请求超时';
			case 404 :
				return '服务不可用';
			case 500 :
				return '服务器出错';
			case 403 : 
				return '请求被拒绝';
			default:
				return '未知错误信息';
		}
	};
	/*Biz.setShowSoftInput = function(ele){
		if (mui.os.android) {
			this.nativeObj.imm.toggleSoftInput(0, this.nativeObj.InputMethodManager.SHOW_FORCED);
		} else {
			this.nativeObj.nativeWebview.plusCallMethod({
				"setKeyboardDisplayRequiresUserAction": false
			});
		}
		var me = this;
		setTimeout(function() {
			ele ? ele.focus() : null;
			if(typeof me.afterSetShowSoftInput == 'function'){
				me.afterSetShowSoftInput.call(me,ele);
			}
		}, 200);
	};*/
	Biz.afterSetShowSoftInput = function(){
	};
	// 绑定事件
	Biz._bindEvent = function(){
		var me = this;
//		me.sendBtnEle.addEventListener('tap',function(evt){
//			if(typeof me.doSendBusiness == 'function'){
//				me.doSendBusiness.call(me,evt);
//			}
//		});
	};
	Biz.doSendBusiness = function(){
	};
	Biz.isEnterKey = function(evt){
		if(!evt){
			return false;
		}
		return (evt.keyCode == 13 || evt.witch == 13);
	}
})(mui,window.Biz = {});
