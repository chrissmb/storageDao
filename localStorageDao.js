var LocalStorageDao = function (tabela) {
  var self = this;
  
  function addId(objeto) {
    var id = parseInt(localStorage.getItem(tabela + 'CountId') || '1');
    objeto.id = id;
    localStorage.setItem(tabela + 'CountId', id + 1);
  }
  
  this.getTabela = function () {
    return tabela;
  }
  this.save = function (objeto) {
    var lista = this.findAll();
    
    if (existe(objeto)) {
      var indice = lista.findIndex(item => item.id == objeto.id);
      lista[indice] = objeto;
    } else {
      addId(objeto);
      lista.push(objeto);
    }
    
    var jsonLista = JSON.stringify(lista);
    localStorage.setItem(tabela, jsonLista);
  }
  
  this.findAll = function () {
    return JSON.parse(localStorage.getItem(tabela) || '[]');
  }
  
  this.findOne = function (id) {
    var lista = this.findAll();
    var result = lista.filter(item => item.id == id);
    return result[0];
  }
  
  this.findBy = function (campo, filtro) {
    return this.findAll().filter(item => item[campo] == filtro);
  }
  
  this.findByFieldsAnd = function (lista) { // lista = [{campo: valor, filtro: valor},...]
    return this.findAll().filter(function (item) {
      var retorno = true;
      lista.forEach(function(x) {
        retorno = retorno && item[x.campo] == x.filtro;
      });
      return retorno;
    });
  }
  
  this.findByFieldsOr = function (lista) { // lista = [{campo: valor, filtro: valor},...]
    return this.findAll().filter(function (item) {
      var retorno = false;
      lista.forEach(function(x) {
        retorno = retorno || item[x.campo] == x.filtro;
      });
      return retorno;
    });
  }
  
  this.findBetween = function (campo, a, b) {
    return this.findAll()
      .filter(item => item[campo] > a && item[campo] < b);
  }
  
  this.findBetweenOrEqual = function (campo, a, b) {
    return this.findAll()
      .filter(item => item[campo] >= a && item[campo] <= b);
  }
  
  this.findLessThan = function (campo, filtro) {
    return this.findAll().filter(item => item[campo] < filtro);
  }
  
  this.findLessThanOrEqual = function (campo, filtro) {
    return this.findAll().filter(item => item[campo] <= filtro);
  }
  
  this.findMoreThan = function (campo, filtro) {
    return this.findAll().filter(item => item[campo] > filtro);
  }
  
  this.findMoreThanOrEqual = function (campo, filtro) {
    return this.findAll().filter(item => item[campo] >= filtro);
  }
  
  this.startsWith = function (campo, filtro) {
    filtro = filtro.toLowerCase();
    return this.findAll()
      .filter(item => item[campo].toLowerCase().startsWith(filtro));
  }
  
  this.delete = function (id) {
    var lista = this.findAll();
    lista = lista.filter(item => item.id != id);
    var jsonLita = JSON.stringify(lista);
    localStorage.setItem(tabela, jsonLita);
  }
  
  this.sortBy = function (campo) {
    var lista = this.findAll();
    return lista.sort(function (a,b) {
      if (a[campo] < b[campo])
        return -1;
      if (a[campo] > b[campo])
        return 1;
      return 0;
    });
  }
  
  function existe(objeto) {
    if (objeto.id == null) {
      return false;
    }
    if (self.findOne(objeto.id) == null) {
      return false;
    }
    return true;
  }
}
