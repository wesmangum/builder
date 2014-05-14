(function() {
  'use strict';
  $(document).ready(init);
  function init() {
    $('#login').click(login);
    $('#sell').click(sell);
    $('#seed').click(seed);
    $('#getForest').click(getForest);
    $('#forest').on('click', '.tree.alive.adult > .chop', chop);
    $('#forest').on('click', '.tree.alive > .grow', grow);
  }
  function login(e) {
    var data = $(this).closest('form').serialize();
    $.ajax({
      url: '/login',
      type: 'POST',
      data: data,
      success: (function(response) {
        console.log(response);
        $('#login').prev().val('');
        $('#username').attr('data-id', response._id);
        $('#username').text(response.username);
        $('.balance-wood').text(("Wood: " + response.wood));
        $('.balance-cash').text(("Cash: " + response.cash));
        console.log(response);
      })
    });
    e.preventDefault();
  }
  function seed() {
    var userId = $('#username').data('id');
    $.ajax({
      url: '/seed',
      type: 'POST',
      data: {userId: userId},
      success: (function(response) {
        $('#forest').append(response);
      })
    });
  }
  function getForest() {
    var userId = $('#username').data('id');
    $.ajax({
      url: ("/forest/" + userId),
      type: 'GET',
      datatype: 'html',
      success: (function(response) {
        $('#forest').empty().append(response);
      })
    });
  }
  function grow(e) {
    e.stopPropagation();
    var tree = $(this).parent();
    var treeId = tree.data('id');
    $.ajax({
      url: ("/tree/" + treeId + "/grow"),
      type: 'PUT',
      datatype: 'html',
      success: (function(response) {
        tree.replaceWith(response);
      })
    });
  }
  function chop(e) {
    e.stopPropagation();
    var tree = $(this).parent();
    var treeId = tree.data('id');
    var userId = $('#username').data('id');
    $.ajax({
      url: ("/tree/" + treeId + "/chop"),
      type: 'PUT',
      data: {userId: userId},
      success: (function(response) {
        tree.replaceWith(response.html);
        $('.balance-wood').text(("Wood: " + response.user.wood));
        $('.balance-cash').text(("Cash: " + response.user.cash));
      })
    });
  }
  function sell(event) {
    var userId = $('#username').data('id');
    var amount = $('#sell').closest('form').serialize();
    var data = {
      userId: userId,
      amount: amount
    };
    console.log(amount);
    $.ajax({
      url: '/trade',
      type: 'PUT',
      data: data,
      success: (function(response) {
        console.log(response);
      })
    });
    event.preventDefault();
  }
})();

//# sourceMappingURL=game.map
