/**
 * oSlider.js
 * v 1.0.0
 * 좌우 슬라이드만 지원.
 * CSS는 직접 만들기
 */
(function($){
    $.fn.extend({
        oSlider: function( opt ) {
            var def = {
                /**
                 * 드래그 이벤트 활성화 유무
                 */
                dragable: false,
                /**
                 * 초기 페이지 및 현재 페이지 번호 (0부터 시작)
                 */
                page: 0,
                /**
                 * 이전 페이지 버튼의 선택자
                 */
                slidePrev: null,
                /**
                 * 다음 페이지 버튼의 선택자
                 */
                slideNext: null,
                /**
                 * 페이지 이벤트 버튼 상위요소의 선택자
                 */
                slidePage: null,
                /**
                 * 자동으로 슬라이드 동작실행될 간격
                 *     > 밀리세컨 단위
                 *     > 0 이면 사용하지 않음
                 */
                auto: 0,
                /**
                 * Error
                 * @param type: 에러번호
                 *      0 : 이전 페이지가 없음, slidePrev 버튼을 누를때 생성
                 *      1 : 다음 페이지가 없음, slideNext 버튼을 누를때 생성
                 *      2 : 애니메이션 동작중, 슬라이드 애니메이션이 구동중일때 이벤트를 중복 실행하는 경우
                 *      3 : 활성화된 페이지, slidePage 에서 활성화된 페이지를 클릭하는 경우
                 */
                error: function(type){
                    switch(type){
                        case 0:
                            alert('첫번째 페이지 입니다.');
                            break;
                        case 1:
                            alert('마지막 페이지 입니다.');
                            break;
                        case 2:
                            // 동작 없음
                            break;
                        case 3:
                            // 동작 없음
                            break;
                    }
                },
                onLoad: function(){},
                afterLoad: function(){},
                beforeSlide: function(page){},
                afterSlide: function(page){},
                slideAnimate: function(n){
                    if ( oO._animate ) {
                        clearTimeout( oO._animate );
                    }
                    if ( n === undefined ) {
                        var wW = $(window).width();
                        var cX = oO.me.css('margin-left').replace('px', '') * -1;
                        n = Math.floor( cX / wW ),
                            oO.old_page = oO.page,
                            moved = cX % $(window).width();

                        if ( moved < (wW * 0.7) && oO.dX < 0 ) {
                            n = oO.old_page - 1;
                        } else if ( moved > ( wW * 0.3 ) && oO.dX > 0 ) {
                            n = oO.old_page + 1;
                        } else {
                            n = oO.old_page;
                        }
                    }

                    if ( n < 0 ) {
                        n = 0;
                    } else if ( n >= oO.max_page - 1 ) {
                        n = oO.max_page - 1;
                    }

                    $(oO.slidePage)
                        .find('.ov').removeClass('ov').end()
                        .find('a').eq(n).addClass('ov');

                    oO.beforeSlide( n );
                    oO.me.animate({marginLeft: n * -100 + '%'}, 200, function(){
                        oO.page = n;
                        oO.afterSlide( oO );
                        if ( oO.auto > 0 ) {
                            oO._animate = setTimeout(function(){
                                var nextPage = oO.page + 1;
                                if ( nextPage > oO.max_page - 1 ) {
                                    nextPage = 0;
                                }
                                oO.slideAnimate( nextPage );
                            }, oO.auto);
                        }
                    });
                }
            };

            var oO = $.extend( def, opt );

            oO.onLoad();

            // 기본설정
            // 이벤트 오브젝트
            oO.me = $(this);
            // 최대 페이지
            oO.max_page = oO.me.children().length;


            if ( oO.slidePage ) {
                // 페이지 만큼 페이지 생성
                for (var i = 0; i < oO.max_page; i++ ) {
                    $(oO.slidePage).append('<a href="#"></a>');
                }

                // 페이지 클릭 이벤트
                $(oO.slidePage).find('a').click(function(e){
                    e.preventDefault();
                    // 활성화 중에는 작동하지 않음
                    if ( $(this).hasClass('ov') ) {
                        return;
                    }

                    oO.slideAnimate( $(this).index() );
                }).eq( oO.page ).trigger('click');
            }

            if ( oO.slideNext ) {
                $(oO.slideNext).click(function(e){
                    e.preventDefault();
                    oO.slideAnimate( oO.page + 1 );
                });
            }

            if ( oO.slidePrev ) {
                $(oO.slidePrev).click(function(e){
                    e.preventDefault();
                    oO.slideAnimate( oO.page - 1 );
                });
            }

            // 터치 이벤트
            if ( oO.dragable === true ) {
                oO.me.bind('touchstart mousedown', function(e){
                    e.preventDefault();
                    oO.sX = e.originalEvent.touches ? e.originalEvent.touches[0].clientX : e.clientX;
                    oO.pX = oO.me.css('margin-left').replace('px', '') * -1;

                    $(this).bind('touchmove mousemove', function(evt) {
                        var mX = evt.originalEvent.touches ? evt.originalEvent.touches[0].clientX : evt.clientX;
                        oO.dX = oO.sX - mX;

                        if (oO.dX > 6 || oO.dX < -6) {
                            e.preventDefault();
                            oO.me.css('margin-left', ((oO.pX + oO.dX) * -1) + 'px');
                        } else {

                        }
                    });
                })
                .bind('touchend mouseup', function(e){
                    e.preventDefault();
                    $(this).unbind('touchmove mousemove');
                    oO.slideAnimate();
                });
            }

            oO.afterLoad();

            if (oO.auto > 0) {
                oO.slideAnimate();
            }
        }
    });
})(jQuery);
