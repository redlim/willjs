var JSGymFront = (function () {

    function HTTP(method, url, body, token, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (xhttp.readyState == 4) {
                if (xhttp.status == 200) {
                    data = JSON.parse(xhttp.responseText);
                    callback(null, data);
                } else {
                    callback(xhttp.status);
                }
            }
        };
        xhttp.open(method, url, true);
        xhttp.setRequestHeader("x-api-key", "da8c8fa2-7cee-4bdd-bd85-247c0cdbe5da");
        if (token) {
            xhttp.setRequestHeader("x-token", token);
        }
        if (method === 'POST' || method === 'PUT') {
            xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send(JSON.stringify(body));
        } else {
            xhttp.send();
        }
    }

    /*

     */
    function singIn(url, newUser, callback) {

        HTTP('POST', url, newUser, null, function (err, res) {
            if (res) {
                callback(err, res);
            } else {
                callback("error al crear el usuario")
            }
        })
    }

    function login(url, credentials, callback) {

        HTTP('POST', url, {usr: credentials.usr, pwd: credentials.pwd}, null,function (err, res) {
            console.log(err,res);
            if (res) {
                localStorage.setItem("token", res.token);
                callback(err, res);
            } else {
                callback("Usuario o contraseña incorrecta", res);
            }

        });

    }

    function logout() {

        localStorage.removeItem("token");
    }

    function isLogged() {

        return localStorage.getItem("token") !== "";
    }

    //JSGymFront.show ('.action-login', JSGymFront.isLogged)
    function show(container, qn) {

        var pn = qn || function () {
                return true;
            };
        if (pn()) {
            $(container).css("display", "block");
        }
        else {
            $(container).css("display", "none");

        }
    }

    function render (data) {
         
        HTTP(data.action.method,data.action.uri,"",null,function (err,res) {
           
            res = [];
            res.push({image :'https://67.media.tumblr.com/avatar_7d19825164bc_128.png',description :"Bob Esponja",active:true});
            res.push({image :'https://pbs.twimg.com/profile_images/733785689414852608/KyP2BtO5.jpg',description :"Calamardo",active:false});
            
            if(res){
                var container = $(data.target.container);
                var templateInactive = $(data.target.template.inactive)[0].innerHTML;
                var templateActive = $(data.target.template.active)[0].innerHTML;
                console.log(templateActive);
                res.forEach(function (d) {
                    var newItem;
                    if(d.active){
                        newItem = Mustache.render(templateActive,d);
                    }else{
                        newItem = Mustache.render(templateInactive,d);
                    }
                    container.append(newItem);
                })
            } else{
                console.log(err);
            }
        });
    }

    // go ({success: 'uri1', fail: 'uri2'}, pn);
    // si pn() es true redirige la pagina a uri1, sino a uri2
    function go(data,pn) {
        if(pn()){
            document.location.href = data.success;
        }else{
            document.location.href = data.fail;
        }
    }


    // todo; is admin devuelve si el usuario es administardor

    return {

        signIn:singIn,
        login:login,
        logout:logout,
        isLogged:isLogged,
        show:show,
        render:render,
        go:go
    };
})();