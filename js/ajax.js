var AJAX = {
    GET: function (url, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);

        xhr.send();

        xhr.onreadystatechange = function () {
            if (this.readyState != 4) return;          

            if (this.status != 200) {
                console.log('Error');
                return;
            }

            callback(JSON.parse(xhr.response));           
        }
    },
    POST: function (url, callback, data) {
        var xhr = new XMLHttpRequest();

        xhr.open('POST', url, true);

        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xhr.send(JSON.stringify(data));

        xhr.onreadystatechange = function () {
            if (this.readyState != 4) return;

            if (this.status != 200) {
                console.log('Error');
                return;
            }

            console.log(xhr.response);
            callback(JSON.parse(xhr.response));
            
        }
    },
    DELETE: function (url, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open('DELETE', url, true);

        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xhr.send();

        xhr.onreadystatechange = function () {
            if (this.readyState != 4) return;

            if (this.status != 200) {
                console.log('Error');
                return;
            }
            console.log(xhr.response);
            callback(JSON.parse(xhr.response));            
        };        
    },
    PUT: function (url, callback, data) {
        var xhr = new XMLHttpRequest();

        xhr.open('PUT', url, true);

        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xhr.send(JSON.stringify(data));

        xhr.onreadystatechange = function () {
            if (this.readyState != 4) return;
            if (this.status != 200) {                
                console.log('Error');
                return;
            }
            console.log(xhr.response);
            callback(JSON.parse(xhr.response));
        }
    }

};

Object.freeze(AJAX);