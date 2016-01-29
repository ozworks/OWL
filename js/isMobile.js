(function(agent){
    // 사용되는 정규식 패턴
    var agentPattern = {
        module: /isMobile.js\?([a-z]*)\=([^"^&]+)/,
        mobile: /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
        script: /\.js$/,
        style: /\.css$/
    };

    var agentFunction = {
        /**
         * getAction
         * 모바일인 경우 수행하는 액션체크
         */
        getAction: function(){
            var scripts = document.getElementsByTagName( 'script' );
            var isMobile = false;

            for (var i in scripts) {
                var o = scripts[i];
                if (agentPattern.module.test(o.src)) {
                    var match = agentPattern.module.exec( o.src );
                    this.callAction( match[1], match[2] );
                    isMobile = true;
                    break;
                } else {

                }
            }

            if (isMobile === false) {
                // 모바일이 아닌경우
            }
        },
        callAction: function( name, param ){
            switch (name) {
                case: 'redirect':
                    this.redirect( param );
                    break;
                case: 'open':
                    this.pathOpen( param );
                    break;

                default: 

                    break;
            }
        },
        redirect: function( url ){
            window.location.href = url;
        },
        pathOpen: function( items ){
            var paths = items.split('|');
            var head = document.head;
            for (var i in paths) {
                var o = paths[i], oO;
                if (agentPattern.script.test(o)) {
                    oO = document.createElement('script');
                    oO.src = o;
                } else if (agentPattern.style.test(o)) {
                    oO = document.createElement('style');
                    oO.href = o;
                    oO.rel = 'stylesheet';
                } else {
                    continue;
                }
                head.appendChild( oO );
            }
        }
    }

    if (agentPattern.mobile.test(agent.substr(0,4))) {
        agentFunction.getAction();
    }

})(navigator.userAgent||navigator.vendor||window.opera);