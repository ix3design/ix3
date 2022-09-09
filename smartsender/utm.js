<script src="https://customer.smartsender.eu/js/client/dl.js"></script>

<script>
    const links = document.querySelectorAll('a');
    
    if( links ) {
        for( const link of links ) {
            if (
                link.href.includes("tg://resolve") || 
                link.href.includes("https://t.me/") ||
                link.href.includes("https://direct.smartsender.com/redirect") || 
                link.href.includes("viber://pa") ||
                link.href.includes("https://vk.com/app") || 
                link.href.includes("vk://vk.com/app") ||
                link.href.includes("https://m.me") ||
                link.href.includes("https://wa.me") || 
                link.href.includes("whatsapp://send")
            ) {
                link.classList.add('ss-btn');
            }
        }
    }
</script>

<script>
    /**
     * Returns string with URL param value.
     *
     * @param {String} param [The Param in URL].
     * @return {String} paramValue [Value that we search in param].
     */
    const getUrlParam = function( param ) {
      if ( ! param ) return;

      const queryString = window.location.search;
      const urlParams = new URLSearchParams( queryString );
      const paramValue = urlParams.get(param);

      // console.log(paramValue);
      return paramValue;
    };

    
    // ssDeepLink params
    const ssContext = {
        variables: {
            utm_source: getUrlParam('utm_source'), // получит параметр "utm_source" из ссылки
            utm_medium: getUrlParam('utm_medium'), // получит параметр "utm_medium" из ссылки
            utm_campaign: getUrlParam('utm_campaign'), // получит параметр "utm_campaign" из ссылки
            utm_content: getUrlParam('utm_content'), // получит параметр "utm_content" из ссылки
            W_chanel: getUrlParam('W_chanel'), // получит параметр "W_chanel" из ссылки
        }
    };
    console.log(ssContext);
    ssDeepLink('ss-btn', 'ваш домен', false, ssContext);
   
</script>
