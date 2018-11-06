/**
 * 自定义图片表格插件
 */
;(function(mui){
	// 图片表格插件构造器
	function listGrid(ele,opts){
		this.container = this.ele = ele[0];
		this.options = mui.extend({},this.defaultOptions,opts);
		this._init();
		return this;
	}
	// 对象原型
	var listGridPt = listGrid.prototype; 
	// 默认参数选项（可覆盖）
	listGridPt.defaultOptions = {
		data: [],    // 表格数据
		extraData:'',
		rowFormatter: function(row,rowEle){}, // 行格式化
		columns: [], // 如：[{'field':'','title':'','width:':'20%',align: '','formatter': function(val,row){},titleFormatter:function(col,rows)}],
	};
	// 默认配置项（不可覆盖）
	listGridPt.config = {
		'tableCls': 'mui-table-view list-table',
		'tableClsSelector': '.mui-table-view.list-table',
		'titleCls': 'mui-table-view-cell title',
		'titleClsSelector': '.mui-table-view-cell.title',
		'liCls': 'mui-table-view-cell body',
		'liClsSelector': '.mui-table-view-cell.body',
		'rowCls': 'mui-row list-table-row',
		'rowClsSelector': '.mui-row.list-table-row',
		'emptyColCls': 'mui-col-sm-12 mui-col-xs-12 text-center',
		'colCls': 'mui-col-sm-4x mui-col-xs-4x lis-table-col',
		'colClsSelector': '.mui-col-sm-4x.mui-col-xs-4x.lis-table-col',
		'emptyText': '没有数据',
	};
	listGridPt._ObjectDataHolder = {
	};
	// 初始化
	listGridPt._init = function(){
		// 是否已经初始化过了
		var initialized = this.container.dataset.initialized;
		// 如果初始化过了，则需要销毁后重新初始化
		if(initialized){
			this.destory();
		}
		this.container.dataset.initialized = true;
		// 开始创建
		this._initGrid();
		// 缓存当前对象
		var key = new Date().getTime() + '_' + Math.random(10000000000);
		this.container.dataset['ThisKey'] = key;
		listGridPt._ObjectDataHolder = {};
		listGridPt._ObjectDataHolder[key] = this;
	};
	listGridPt._initGrid = function(){
		// 创建元素
		this._createElements(this.options.data);
		// 绑定事件
		this._bindEvent();
	};
	listGridPt._createElements = function(rows){
		this.container.innerHTML = '';
		this._createHeadElements();
		this._createBodyElements(rows);
	};
	listGridPt._createHeadElements = function(){
		this.container.className = this.config.tableCls;
		// 标题
		var me = this,
			cfg = me.config,
			cols = me.options.columns || [],
			li = document.createElement('li'),rowDiv,colDiv;
		li.className = cfg.titleCls;
		me.container.appendChild(li);
		rowDiv = document.createElement('div');
		rowDiv.className = cfg.rowCls;
		li.appendChild(rowDiv);
		mui.each(cols,function(i,o){
			colDiv = document.createElement('div');
			colDiv.className = cfg.colCls;
			if(typeof cols[i].titleFormatter == 'function'){
				colDiv.innerHTML = cols[i].titleFormatter.call(me,cols[i],me.options.data,me.options.extraData,this);
			}else{
				colDiv.innerHTML = cols[i].title || '';
			}
			colDiv.setAttribute('field',cols[i].field);
			me._setColStyle(colDiv,cols[i],me.options);
			rowDiv.appendChild(colDiv);
		});
	};
	listGridPt._setColStyle = function(colEle,colOpts,opts){
		var colWidth = this._calcColumnWidth(this.options);
		colEle.style.width = colOpts.width ? colOpts.width : colWidth;
		if(colOpts.hidden){
			colEle.style.display = 'none';
		}
	};
	listGridPt._calcColumnWidth = function(opts){
		var cols = opts.columns || [],_cols = [];
		for(var i=0;i<cols.length;i++){
			if(cols[i].hidden){ // 隐藏列不参与计算宽度
				continue;
			}
			_cols.push(cols[i]);
		}
		var colWidth = (_cols && _cols.length) ? Number(100/_cols.length).toFixed(3) : 100;
		return colWidth + '%';
	}, 
	listGridPt._createEmptyBody = function(){
		var me = this,cfg = me.config,li;
		li = document.createElement('li')
		li.className = cfg.liCls;
		me.container.appendChild(li);
		rowDiv = document.createElement('div');
		rowDiv.className = cfg.emptyColCls;
		rowDiv.innerHTML = cfg.emptyText || '';
		li.appendChild(rowDiv);
	};
	listGridPt._createBodyElements = function(rows){
		var me = this,cfg = me.config,row,li,rowDiv,colDiv,
			cols = me.options.columns || [],rows = rows || [];
		if(!rows || !rows.length){
			me._createEmptyBody();
			return false;
		};
		// 创建行
		mui.each(rows,function(i,o){
			row = rows[i];
			li = document.createElement('li');
			li.className = cfg.liCls;
			me.container.appendChild(li);
			rowDiv = document.createElement('div');
			rowDiv.className = cfg.rowCls;
			li.appendChild(rowDiv);
			if(typeof me.options.rowFormatter == 'function'){
				me.options.rowFormatter.call(me,row,li);
			}
			mui.each(cols,function(j,oo){
				colDiv = document.createElement('div');
				colDiv.className = cfg.colCls;
				if(typeof cols[j].formatter == 'function'){
					colDiv.innerHTML = cols[j].formatter.call(me,row[cols[j].field] || '',row);
				}else{
					colDiv.innerHTML = row[cols[j].field] || '';
				}
				colDiv.setAttribute('field',cols[j].field);
				me._setColStyle(colDiv,cols[j],me.options); 
				rowDiv.appendChild(colDiv);
			});
		});
	};
	listGridPt._bindEvent = function(){
	};
	// 销毁表格
	listGridPt.destory = function(){
		this.container.innerHTML = '';
		this.container.dataset.initialized = false;
//		this.container.classList.remove(this.config.tableCls);
		this.container.className = '';
		this._ObjectDataHolder = {};
	};
	// 加载数据
	listGridPt.loadData = function(rows){
		this._createElements(rows);
	};
	// 获取表格的所有数据
	listGridPt.getRows = function(){ 
		var me = this,rows = [],
			bodys = this.container.querySelectorAll(me.config.liClsSelector),
			rowEles = [];
		if(!bodys || !bodys.length){
			return rows;
		}
		var rowEle;
		mui.each(bodys,function(){
			rowEle = this.querySelector(me.config.rowClsSelector);
			if(rowEle){
				rowEles.push(rowEle);
			} 
		});
		if(!rowEles || !rowEles.length){
			return rows;
		}
		var colEles,row,field;
		mui.each(rowEles,function(i,o){
			row = {};
			colEles = this.querySelectorAll(me.config.colClsSelector);
			if(colEles && colEles.length){
				mui.each(colEles,function(j,oo){
					field = this.getAttribute('field') || '';
					if(field){
						row[field] = this.innerHTML;
					}
				});
			}
			rows.push(row);
		});
		return rows;
	};
	// 获取选中的图片数据
	listGridPt.getSelectedRows = function(){
	};
	// 更新行数据(注：rowIndex从0开始)
	listGridPt.updateRow = function(rowIndex,row){
		var me = this,rows = [],
			cols = me.options.columns || [],
			rowEle = this.container.querySelector(me.config.liClsSelector + ':nth-child(' + (rowIndex + 2) + ')'),
			colEles = rowEle ? rowEle.querySelectorAll(me.config.colClsSelector) : [],
			field,colsKV = {},col;
		mui.each(cols,function(i,o){
			colsKV[cols[i].field] = cols[i];
		});
		mui.each(colEles,function(i,o){
			field = this.getAttribute('field');
			col = colsKV[field] || {};
			if(typeof col.formatter == 'function'){ 
				this.innerHTML = col.formatter.call(me,row[col.field] || '',row);
			}else{
				this.innerHTML = row[col.field] || '';
			}
		});
		if(typeof me.options.rowFormatter == 'function'){
			me.options.rowFormatter.call(me,row,rowEle);
		}
	};
	// 扩展mui的方法
	mui.fn.listGrid = function(args){
		if(typeof args == 'string'  
			&& args.indexOf('_') != 0
			&& listGridPt[args]  
			&& typeof listGridPt[args] == 'function'){
			var key = this[0].dataset.ThisKey;
			var THIS = listGridPt._ObjectDataHolder[key];
			if(!THIS)
			{
				return;
			}	
			if(!this[0].dataset.initialized){
				throw '表格插件还没有被初始化，请先初始化后再调用方法，初始化方法如：mui("#table").listGrid(options)';
			}
			return listGridPt[args].apply(THIS,Array.prototype.slice.call(arguments, 1));
		}else if(typeof args == 'object'){
			return new listGrid(this,args);
		}else{
			throw "list grid not support the arguments:" + args;
		}
	};
})(mui);
