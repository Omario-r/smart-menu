
let token = null,
loaderAction = undefined,
requests = 0;


function request(uri, params = {}, data = {}) {
return new Promise((resolve, reject) => {

  // Create object

  let xhr = new XMLHttpRequest();

  // Transform url
  if (uri.substr(0,4) !== 'http') uri = "/api" + uri;

  /*if (params && params.getParams) {
    uri += '?' + params.getParams();
  }*/

  xhr.open(params.method, uri);

  // Set token header
  if (token) xhr.setRequestHeader("Authorization", token);

  if (params.requestType === 'download') {
    xhr.responseType = "blob";
  }

  // Custom headers:
  if (params.headers) {
    Object.keys(params.headers).forEach(key => {
      xhr.setRequestHeader(key, params.headers[key]);
    });
  }

  // Transform data depends of type: JSON|FormUrlEncoded|FormMultipart

  if (data && (params.requestType === undefined || params.requestType === 'json') && typeof data === 'object') {
    xhr.setRequestHeader("Content-Type", "application/json");
    data = JSON.stringify(data);
  }

  if (data && params.requestType === 'form-url') {
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    data = Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
  }

  var formData = new FormData();

  if (data && params.requestType === 'form-multipart') {
    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    Object.keys(data).forEach(key => { formData.append(key, data[key]); });
    data = formData;
  }

  if (data && params.requestType === 'upload') {
    // xhr.setRequestHeader("Content-Type", 'multipart/form-data');
    formData.append('image', data)
    data = formData;
  }

  // Expose rels and fields
  if (params.expose) {
    xhr.setRequestHeader("exposeRels", params.expose);
  }

  // Response processor
  xhr.onload = function() {
    if (loaderAction) {
      requests--;
      if (requests === 0) loaderAction(false);
    }
    let response;
    if (params.requestType === 'download') {
      response = {
        response: xhr.response,
        filename: xhr.getResponseHeader('filename'),
        filetype: xhr.getResponseHeader('content-type'),
      };
    } else {
      response = xhr.responseText;
    }
    if (xhr.getResponseHeader('content-type') && xhr.getResponseHeader('content-type').indexOf('application/json') !== -1) {
      response = JSON.parse(response);
    }
    if (xhr.status >= 200 && xhr.status < 300) {
      resolve(response);
    } else {
      reject({
        status: this.status,
        response,
        xhr
      });
    }
  };

  // Error processor

  xhr.onerror = function () {
    if (loaderAction) {
      requests--;
      if (requests === 0) loaderAction(false);
    }
    reject({
      status: this.status,
      response: xhr.responseText,
      xhr
    });
  };

  // Let's DO IT!
  if (loaderAction) {
    requests++;
    loaderAction(true);
  }
  xhr.send(data);

});
}

function get(uri, params) {
return request(uri, Object.assign({method:"GET"}, params), null);
}

function post(uri, data, params) {
return request(uri, Object.assign({method:"POST"}, params), data);
}

function put(uri, data, params) {
return request(uri, Object.assign({method:"PUT"}, params), data);
}

function patch(uri, data, params) {
return request(uri, Object.assign({method:"PATCH"}, params), data);
}

function del(uri) {
return request(uri, {method:"DELETE"});
}

function getList(uri, params) {
if (params.pagination && params.sorter) {
  let p = {...params};
    p.pagination = {
      size: params.pagination.pageSize,
      page: params.pagination.current - 1,
    };
    p.sorter = {
      field: p.sorter.field,
      order: p.sorter.order,
    };

  return new Promise((resolve, reject) => {
    get(uri+'?jq='+JSON.stringify(p)).then(resp => {
      resp.pagination = {
        current: resp.pagination.page + 1,
        total: resp.pagination.total,
        pageSize: params.pagination.pageSize,
      }
      resolve(resp);
    }, reject);
  });
} else {
  return new Promise((resolve, reject) =>
    get(uri+'?jq='+JSON.stringify(params))
      .then(resolve, reject)
    )
}
}


function download(uri) {
return new Promise((resolve, reject) => {
  request(uri, Object.assign({ method:"GET", requestType: 'download' }), null)
  .then(({response,filename, filetype}) => {
    // Create a new Blob object using the
    //response data of the onload object
    var blob = new Blob([response], {type: filetype});
    //Create a link element, hide it, direct
    //it towards the blob, and then 'click' it programatically
    let a = document.createElement("a");
    a.style = "display: none";
    document.body.appendChild(a);
    //Create a DOMString representing the blob
    //and point the link element towards it
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    //programatically click the link to trigger the download
    a.click();
    //release the reference to the file by revoking the Object URL
    window.URL.revokeObjectURL(url);
    resolve();
  })
  .catch(err => reject(err));
});
}

function upload(uri, data){
return new Promise((resolve, reject) => {
  request(uri, Object.assign({ method:"POST", requestType: 'upload' }), data)
    .then(res => resolve(res.image))
    .catch(err => reject(err));
})
}

const setToken = t => { token = t; }
const clearToken = () => { token = undefined; }
const setLoaderAction = f => { loaderAction = f; }


export default { request, get, post, put, patch, del, getList, download, upload }
export { setToken, clearToken, setLoaderAction }