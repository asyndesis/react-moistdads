<?php 
  $dadId = '';
  $file = file_get_contents('./index.html', true);
  //echo $file;
  $parts = explode('/', $_SERVER['REQUEST_URI']);
  /* Check to see we have these url parts */
  if ( isset($parts[1]) && isset($parts[2]) ){
    /* Are we on a dad landing page? */
    if ($parts[1] === 'dad'){
      $dadId = $parts[2];
    }
  }
  echo str_replace('</head>','<meta property="og:image" content="http://moistdads.com:4100/api/getDadThumb/'.$dadId.'" /></head>', $file)
?>
