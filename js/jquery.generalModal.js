/*--------------------------------------------------------------------------*
 *  generalModal.js
 *  MIT-style license.
 *  2013 Komei Otake
 *--------------------------------------------------------------------------*/
;(function($){
	$.fn.generalModal = function(config){
		// デフォルトオプションの設定
		var options = $.extend({
			openSpeed:500,
			closeSpeed:500,
			backLayer:true,
			backLayerOpacity:0.5,
			closeClass:".generalModalClose",
			onload:false,
			loadPanelClass:".loadPanel",
			backLayerId:"#backLayer"
		}, config);

		// レイヤーを敷く場合
		if(options.backLayer === true) {
			// レイヤーを挿入してスタイリング
			$("body").append($("<div id="+options.backLayerId+"></div>").css({
				display: "none",
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				width: $(document).width(),
				height: $(document).height(),
				background: "rgba(0,0,0,"+options.backLayerOpacity+")"
			}));
		}

		this.each(function() {
			// 変数定義
			var $self = $(this);
			var $panel = $($self.attr("href"));
			// ここでjQueryオブジェクトにできない
			var $backLayer = $(options.backLayerId);

			// モーダルを消す（JS無効環境を考慮し、JSで消す）
			$panel.hide();

			// モーダルの位置を調整する関数
			function modalPos () {
				// ウィンドウの幅を取得して変数に入れる
				var windowWidth = $(window).outerWidth();
				// パネルの幅を取得して変数に入れる
				var panelWidth = $panel.outerWidth();

				// ウィンドウの幅を半分にし、パネルの半分のサイズを引いた値を変数に入れる
				windowWidth = (windowWidth / 2) - (panelWidth / 2);
				// 上記の数字をleftに入れ、左右中央に配置
				$panel.css('left',windowWidth);

				// ウィンドウの高さを取得して変数に入れる
				var windowHeight = $(window).outerHeight();
				// パネルの高さを取得して変数に入れる
				var panelHeight = $panel.outerHeight();
				// ウィンドウのスクロール量を取得して変数に入れる
				var windowScroll = $(window).scrollTop();

				// ウィンドウの高さを半分にし、パネルの半分のサイズを引いた値を変数に入れる
				windowHeight = (windowHeight / 2) - (panelHeight / 2) + windowScroll;
				// 上記の数字をtopに入れ、上下中央に配置
				$panel.css('top',windowHeight);
			}

			// モーダルを呼び出す時の処理をまとめた関数
			function modalOpen () {
				// 位置調整関数を発火
				modalPos();
				// レイヤーをfadeIn
				$backLayer.fadeIn(options.openSpeed);
				// そのhrefに該当する要素をfadeInさせる
				$panel.fadeIn(options.openSpeed);
			}

			// モーダルを消す時の処理をまとめた関数
			function modalClose () {
				// パネルをfadeOutさせる
				$panel.fadeOut(options.closeSpeed);
				// レイヤーをfadeOutさせる
				$backLayer.fadeOut(options.closeSpeed);
			}

			// onloadオプションがtrueだったら
			if(options.onload === true) {
				var $loadPanel = $(options.loadPanelClass);
				// ウィンドウがロードされた時
				$(window).on("load", function(){
					// 開くパネルをオプションで指定したclassを付与したものに書き換え
					$panel = $loadPanel;
					// モーダルを呼び出す時の処理をまとめた関数を発火
					modalOpen();
				});
			}

			// もし、モーダルのボタンがクリックされたら
			$self.on("click", function(){
				// $panelの値をクリックされた要素のhrefに書き換え
				$panel = $($self.attr("href"));

				// もし、クリックされた要素の
				// hrefに入った要素がdisplay:noneだったら
				if($panel.css("display") === "none") {
					// モーダルを呼び出す時の処理をまとめた関数を発火
					modalOpen();
				}
				// a要素でも大丈夫なように、ブラウザの挙動を止める
				return false;
			});

			// 背景レイヤーがクリックされたら
			$backLayer.on("click", function(){
				// モーダルを消す時の処理をまとめた関数を発火
				modalClose();
			});
			// 閉じるボタンが押されたら
			$(options.closeClass).on("click", function(){
				// モーダルを消す時の処理をまとめた関数を発火
				modalClose();
				// a要素でも大丈夫なように、ブラウザの挙動を止める
				return false;
			});

			// リサイズ、スクロール時
			// タイマー変数を指定
			var timer;
			$(window).on("resize scroll", function() {
				// タイマーリセット
				clearTimeout(timer);
				// 位置調整関数を発火（setTimeoutで頻繁に発生しないように）
				timer = setTimeout(function() {
					modalPos();
				}, 300);
			});
		});
	return this;
	};
})(jQuery);