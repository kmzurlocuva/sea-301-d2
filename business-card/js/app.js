
var articles = [];

function Article (options) {
  this.author = options.author;
  this.authorUrl = options.authorUrl;
  this.title = options.title;
  this.category = options.category;
  this.body = options.body;
  this.publishedOn = options.publishedOn;
}

Article.prototype.toHtml = function() {
  var $newArticle = $('article.template').clone();
  $newArticle.removeClass('template');
  if (!this.publishedOn) {
    $newArticle.addClass('draft');
  }

  $newArticle.attr('data-category', this.category);
  $newArticle.attr('data-author', this.author);



  $newArticle.find('.byline a').html(this.author);
  $newArticle.find('.byline a').attr('href', this.authorUrl);
  $newArticle.find('h1:first').html(this.title);
  $newArticle.find('.article-body').html(this.body);
  $newArticle.find('time[pubdate]').attr('datetime', this.publishedOn)
  $newArticle.find('time[pubdate]').attr('title', this.publishedOn)
  $newArticle.find('time').html('about ' + parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000) + ' days ago')
  $newArticle.append('<hr>');
  return $newArticle;
}

content.sort(function(a,b) {
  return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
});

content.forEach(function(ele) {
  articles.push(new Article(ele));
})

articles.forEach(function(a){
  $('#articles').append(a.toHtml())
});

var articleView = {};

articleView.populateFilters = function() {
  $('article').each(function() {
    if (!$(this).hasClass('template')) {
      var val = $(this).find('.author-name').text();
      var optionTag = '<option value="' + val + '">' + val + '</option>';
      $('#contentSelect').append(optionTag);

      val = $(this).attr('data-category');
      optionTag = '<option value="' + val + '">' + val + '</option>';
      if ($('#category-filter option[value="' + val + '"]').length === 0) {
        $('#category-filter').append(optionTag);
      }
    }
  });
};


articleView.handleArticleDisplay = function() {
  $('#contentSelect').on('change', function() {
    if ($(this).val()) {
      $('article').hide();
      $('article[data-author="' + $(this).val() + '"]').fadeIn();
    } else {
      $('article').fadeIn();
      $('article.template').hide();
    }
    $('#category-filter').val('');
  });
};

articleView.handleMainNav = function() {
    $('main-nav').on('click', '.tab', function(event) {
      event.preventDefault();
      $(this).parent().find('*').fadeIn();
      $(this).hide();
    });
  };



$(document).ready(function(){
  articleView.handleArticleDisplay();
  articleView.handleMainNav();
  articleView.populateFilters();
});
