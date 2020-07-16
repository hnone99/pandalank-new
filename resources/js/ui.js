(function() {
    var html = document.documentElement;
    html.className = html.className.replace(/\bno-js\b/, 'js');
    //html.className += ((window.CSS && window.CSS.supports('(position: sticky) or (position: -webkit-sticky)')) ? ' csssticky' : ' no-csssticky');
    html.className += (window.matchMedia('(-moz-touch-enabled: 1), (hover: none)')).matches ? ' hover-disabled' : ' hover-enabled';
    //html.style.setProperty('--window-height', window.innerHeight + 'px');
})();

(function($) {
    var Init = {
        defaults : function(){
            var bodyHeight = 0;
            var bodyWidth = 0;
            var breakpoint;
            this.resize();
            window.addEventListener("resize", this.resize);
        },
        resize : function(){
            Init.getBrowserSize();
            Init.drawBreakPoint();

            Init.breakpoint = window.matchMedia('(min-width:992px)').matches;
            if(!Init.breakpoint){
                $('html').removeClass('is-desktop');
                $('html').addClass('is-mobile');
            }else{
                $('html').removeClass('is-mobile');
                $('html').addClass('is-desktop');
            }
        },
        getBrowserSize : function(){
            this.bodyHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            this.bodyWidth = Math.max(
                document.body.scrollWidth,
                document.body.offsetWidth,
                document.documentElement.clientWidth,
                document.documentElement.scrollWidth,
                document.documentElement.offsetWidth
            );
        },
        drawBreakPoint : function(){
            $('html').attr('data-width',this.bodyWidth);
            $('html').attr('data-height',this.bodyHeight);
        },
    };

    //header
    var Header = {
        init : function(){
            Header.scrolling();
            Header.gnb();
            Header.side();
            Header.category();
            window.addEventListener('mousewheel', Header.scrolling);
            window.addEventListener('touchmove', Header.scrolling);
            $(window).scroll(function(){
                Header.scrolling();
            });
        },
        scrolling : function(e){
            var scrollTop = $(window).scrollTop();
            var gnbTop = $('#header').height();
            gnbTop = Number(gnbTop);

            //if(scrollTop > 0){
            if(scrollTop > $('.header-top').height()){
                $('html').addClass('is-compacted');
            }else{
                $('html').removeClass('is-compacted');
            }

            if(scrollTop > 0){
                $('html').addClass('is-scrolled');
            }else{
                $('html').removeClass('is-scrolled');
            }
        },
        gnb : function(){
            const breakpoint = window.matchMedia( '(min-width:768px)' );

            let gnbSwiper;

            const breakpointChecker = function() {
                if ( breakpoint.matches === true ) {
                    if ( gnbSwiper !== undefined ) gnbSwiper.destroy( true, true );
                    return;
                } else if ( breakpoint.matches === false ) {
                    return enableSwiper();
                }
            };
            const enableSwiper = function() {
                gnbSwiper = new Swiper('.gnb nav', {
                    slidesPerView: 'auto',
                    freeMode: true,
                    slidesOffsetBefore: 12,
                    slidesOffsetAfter: 12
                });
            };
            breakpoint.addListener(breakpointChecker);
            breakpointChecker();
        },
        side : function(){
            $('.btn-menu').on('click',function(e){
                e.preventDefault();
                $('html').toggleClass('open-side');
            });
        },
        category : function(){
            const breakpoint = window.matchMedia( '(min-width:1279px)' );

            let categorySwiper;

            const breakpointChecker = function() {
                if ( breakpoint.matches === true ) {
                    if ( categorySwiper !== undefined ) categorySwiper.destroy( true, true );
                    return;
                } else if ( breakpoint.matches === false ) {
                    return enableSwiper();
                }
            };
            const enableSwiper = function() {
                categorySwiper = new Swiper('.category nav', {
                    slidesPerView: 'auto',
                    freeMode: true,
                    slidesOffsetBefore: 12,
                    slidesOffsetAfter: 12
                });
            };
            breakpoint.addListener(breakpointChecker);
            breakpointChecker();
        },
    };

    var Layout = {
        init : function(){
            Layout.resize();
            window.addEventListener("resize", this.resize);
        },
        resize: function(){
            Init.breakpoint = window.matchMedia('(min-width:1366px)').matches;
            if(!Init.breakpoint){
                if(Init.bodyWidth){
                    $('html').addClass('is-collapsed');
                }
            }
            else{
                $('html').removeClass('is-collapsed');
            }
        }
    };

    var Tab = {
        init : function(){
            Tab.active();
        },
        active: function(){
            $('.tab a').on('click',function(e){
                e.preventDefault();
                $(this).parent('li').siblings().removeClass('active');
                $(this).parent('li').addClass('active');
                $(this).closest('.tab').attr('data-position',$(this).parent('li').index() + 1);
            });
        }
    };

    var Dropdown = {
        init : function(){
            Dropdown.active();
            //드롭박스 디폴트 텍스트
            $('.dropdown').each(function(e) {
                $(this).attr('data-default',$(this).find('.dropdown-value').text());
            });
            //드롭박스 리스트 높이만큼 margin 세팅
            $('.dropdown-box').each(function(e) {
                var boxHeight = $(this).outerHeight();
                $(this).closest('.dropdown').css('margin-bottom',boxHeight + 25);
            });
        },
        active : function(){
            $('.dropdown').on('click', function(e) {
                var $target = $(this).closest(".dropdown");

                if($target.hasClass('active')){
                    $(this).removeClass('active');
                    $('html').removeClass('open-dropdown');
                }else{
                    $(".dropdown.active").removeClass('active');
                    $(this).addClass('active');
                    $('html').addClass('open-dropdown');
                }
            });
            $('.dropdown-list > div').on('click', function(e) {
                $(this).closest('.dropdown').find('.dropdown-value').text($(this).text());
                if($(this).text() !== $(this).closest('.dropdown').attr('data-default')){
                    $(this).closest('.dropdown').find('.dropdown-value').addClass('filled');
                    $(this).siblings().removeClass('text-primary');
                    $(this).addClass('text-primary');
                }else{
                    $(this).closest('.dropdown').find('.dropdown-value').removeClass('filled');
                }
            });
            $(document).click(function(e) {
                if(!$('.dropdown').has(e.target).length){
                    $(".dropdown.active").removeClass('active');
                    $('html').removeClass('open-dropdown');
                }
            });
        }
    };

    var UiFunction = {
        init : function(){
            //datepicker
            $('[data-event="datepicker"]').datepicker({
                changeMonth: true,
                changeYear: true,
                dateFormat: 'yy-mm-dd'
            });

            //textarea focus
            $('.comment-textarea textarea').on('focus',function(){
                $(this).closest('.box').addClass('active');
            });

            //좋아요
            $('.icon-heart').on('click',function(){
                if ($(this).find('.heart-fill').hasClass('heart-filled')) {
                    $(this).find('.heart-fill').removeClass('heart-filled');
                    $(this).removeClass('animation-grow');

                } else {
                    $(this).find('.heart-fill').addClass('heart-filled');
                    $(this).addClass('animation-grow');
                }
            });

            //검색영역 토글
            $('.btn-collapse').on('click',function(){
                $('html').toggleClass('is-collapsed');
            });

            //게시판 형식 list/view 토글
            $('.board-list .subject a').on('click',function(e){
                e.preventDefault();
                $(this).closest('li').toggleClass('active');
            });

            //툴팁
            $('[data-toggle=pop-over]').on('mouseenter',function(e){
                Init.breakpoint = window.matchMedia('(min-width:992px)').matches;
                if(Init.breakpoint){
                    $($(this).attr('href')).addClass('hover');
                }
            }).on('mouseleave',function(e){
                if(Init.breakpoint){
                    $($(this).attr('href')).removeClass('hover');
                }
            });
            $('[data-toggle=pop-over]').on('click', function (e) {
                Init.breakpoint = window.matchMedia('(min-width:992px)').matches;
                if (!Init.breakpoint) {
                    e.preventDefault();
                    $($(this).attr('data-target-mobile')).modal('show');
                }
            });
        }
    };

    $(document).ready(function () {
        setTimeout(function () {
            //goTop();
            Init.defaults();
            Header.init();
            Layout.init();
            Tab.init();
            Dropdown.init();
            UiFunction.init();
        }, 200);
    });

})(jQuery);

