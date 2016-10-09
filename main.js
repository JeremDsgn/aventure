convertToHTML = (elm) => {
  return elm.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

$(window).load(function() {
  // Global selectors
  const body = $('body');
  const nav = $('.navigation');
  const open =  $('.countries')
  const post = '.post';
  const postList = $('.list');

  // Item animation
  const translate = 'translateY(0)';
  const delay = (i) => (95 * (i + 2)) + 'ms';

  const postAppear = (elm, i) =>
    elm.css({
      '-webkit-transition-delay': delay(i),
      '-ms-transition-delay': delay(i),
      'transition-delay': delay(i),

      '-webkit-transform': translate,
      '-ms-transform': translate,
      'transform': translate,

      'opacity': 1,
    });

  // Tags navigation
  const tagsArray = [];

  $(post)
    .filter((i, item) => $(item).data('tag') !== undefined)
    .map((i, item) => {
      const tag = $(item).data('tag');
      if (tagsArray.indexOf(tag) < 0) tagsArray.push(tag);
    });

  // Display tags in the nav
  tagsArray.map(function(item, i) {
    const linkTag = '&lt;li&gt;&lt;a href="http://photo.jeremybarbet.com/tagged/' + item + '"&gt;' + item + '&lt;/a&gt;&lt;/li&gt;';
    const navLink = nav.find('.nav-countries .title');

    $(convertToHTML(linkTag)).insertAfter(navLink);
  });

  // Open animation
  open.on('click', function(e) {
    nav.addClass('slideLeft');
    nav.removeClass('slideRight');

    nav.on('animationend webkitAnimationEnd oAnimationEnd', function() {
      $(this).find('ul').addClass('fadeInLeft');
    });

    body.addClass('unscroll', 'nav-is-open');
    e.preventDefault();
  });

  // Close animation
  nav.on('click', function(e) {
    nav.addClass('slideRight');

    setTimeout(() => {
      nav.removeClass('slideLeft', 'slideRight');
      $(this).find('ul').removeClass('fadeInLeft')
    }, 400);

    body.removeClass('unscroll', 'nav-is-open');
  });

  postList.imagesLoaded(function() {
    postList.masonry({
      itemSelector: post,
      isFitWidth: true,
      transitionDuration: 0,
    });

    postList.on('layoutComplete', function() {
      postList.find(post).map(function(i) {
        postAppear($(this), i);
      });
    });

    postList.find(post).map(function(i) {
      postAppear($(this), i);
    })
  });

  postList.infinitescroll({
    navSelector: '.pagination',
    nextSelector: '.pagination li .pagination_nextlink',
    itemSelector: post,
    bufferPx: 600,
    loading: {
      selector: '.loader',
      finishedMsg: 'Wow, you just watched all my photos. Thanks! 🎉',
      msg: $('<svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#333"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity=".5" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" /></path></g></g></svg>'),
    },
  }, function(elements) {
    const nextPosts = $(elements);
    const ids = nextPosts.map(() => this.id).get();

    nextPosts.imagesLoaded(function() {
      Tumblr.LikeButton.get_status_by_post_ids(ids);

      postList.append(nextPosts).masonry('appended', nextPosts);

      nextPosts.map(function(i) {
        postAppear($(this), i);
      });
    });
  });
});
