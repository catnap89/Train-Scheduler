$(document).ready(function() {

  // Initialize Bootstrap Popover

  $(function () {

    $('.btn-next-arrival').popover({
      title: 'Next Arrival',
      content: 'Next Train Arrival Time. It is updated in real time upon train arrival.',
      container: '.row-contents-container',
      placement : 'top',
      trigger: 'hover'
    });

    $(".btn-minutes-away").popover({
      title: 'Minutes Away',
      content: 'Time in minutes until next train arrives. Updates every minute.',
      container: '.row-contents-container',
      placement : 'top',
      trigger: 'hover'
    });

  })

})