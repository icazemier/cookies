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



const getServerToRevealCookies = () => {
    fetch('http://localhost:3000/reveal-secret')
        .then(response => {
            return response.json();
        })
        .then(data => {
            document.getElementById('cookies-read-by-server').value = JSON.stringify(data, undefined, 2);

            const somesecret = getCookie('somesecret');
            const realsecret = getCookie('realsecret');
            document.getElementById('cookies-read-by-client').value = JSON.stringify({ somesecret, realsecret }, undefined, 2);
        });
};

const getCookieFromServer = () => {
    fetch('http://localhost:3000/cookie')
        .then(response => {
            console.log(response);
        })
        .then(data => {
            return getServerToRevealCookies();
        });
};

const getHttpOnlyCookieFromServer = () => {
    fetch('http://localhost:3000/http-only-cookie')
        .then(response => {
            console.log(response);
        })
        .then(data => {
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


