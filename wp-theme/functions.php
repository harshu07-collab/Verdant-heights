<?php
/**
 * Verdant Heights Landing — Theme Functions
 */

// Register page template
add_filter('theme_page_templates', function ($templates) {
  $templates['page-landing.php'] = 'Verdant Heights Landing';
  return $templates;
});

// Load template from theme
add_filter('template_include', function ($template) {
  if (is_page() && get_page_template_slug() === 'page-landing.php') {
    $file = get_template_directory() . '/page-landing.php';
    if (file_exists($file)) return $file;
  }
  return $template;
});

// Enqueue assets
add_action('wp_enqueue_scripts', function () {
  // Fonts
  wp_enqueue_style('vh-google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap', [], null);

  // Landing styles
  wp_enqueue_style('vh-landing', get_template_directory_uri() . '/assets/landing.css', ['vh-google-fonts'], '1.0.0');

  // Landing script (jQuery required)
  wp_enqueue_script('vh-landing', get_template_directory_uri() . '/assets/landing.js', ['jquery'], '1.0.0', true);
});

// Theme support
add_action('after_setup_theme', function () {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('custom-logo');
  add_theme_support('html5', ['style', 'script']);
});

// Remove admin bar on landing page
add_filter('show_admin_bar', function ($show) {
  if (is_page_template('page-landing.php')) return false;
  return $show;
});
