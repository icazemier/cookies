function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}



document.addEventListener('DOMContentLoaded', function (event) {

    const requestCookieButton = document.getElementById('request-cookie');
    const requestHttpOnlyCookieButton = document.getElementById('request-http-only-cookie');
    const hackCookieButton = document.getElementById('hack-local-cookie');
    const eraseCookieButton = document.getElementById('erase-local-cookie');
    
    requestCookieButton.addEventListener("click", getCookieFromServer);
    requestHttpOnlyCookieButton.addEventListener("click", getHttpOnlyCookieFromServer);
    hackCookieButton.addEventListener("click", hackCookies);
    eraseCookieButton.addEventListener("click", eraseCookies);
});


/**
 * This function is used to get the cookies from the server (just to show which cookies the server sees)
 * AND from the client and display them in the corresponding textarea.
 */
const getServerToRevealCookies = () => {
    fetch('http://localhost:3000/reveal-secret')
        .then(response => {
            return response.json();
        })
        .then(data => {
            document.getElementById('cookies-read-by-server').value = JSON.stringify(data, undefined, 2);

            const somesecret = getCookie('somesecret');
            const realsecret = getCookie('realsecret');

            let cookies = {};
            if (somesecret) {
                cookies = {...cookies, somesecret};
            }
            if (realsecret) {
                cookies = {...cookies, realsecret};
            }

            document.getElementById('cookies-read-by-client').value = JSON.stringify(cookies, undefined, 2);
        });
};

/**
 * Gets a cookie from the server that is readable by the client.
 */
const getCookieFromServer = () => {
    fetch('http://localhost:3000/cookie')
        .then(response => {
            console.log('response:', response);
        })
        .then(() => {
            return getServerToRevealCookies();
        });
};

/**
 * Gets a httpOnly cookie from the server that is not readable by the client.
 */
const getHttpOnlyCookieFromServer = () => {
    fetch('http://localhost:3000/http-only-cookie')
        .then(response => {
            console.log(response);
        })
        .then(() => {
            return getServerToRevealCookies();
        });
};

const hackCookies = () => {
    setCookie('somesecret', 'Hackerman!');
    setCookie('realsecret', 'Hackerman!');
    getServerToRevealCookies();
}

const eraseCookies = () => {
    eraseCookie('somesecret');
    eraseCookie('realsecret');
    getServerToRevealCookies();
}


