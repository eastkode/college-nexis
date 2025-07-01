<?php
/**
 * College Nexis Theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package College_Nexis_Theme
 */

if ( ! defined( 'COLLEGE_NEXIS_THEME_VERSION' ) ) {
	// Replace the version number of the theme on each release.
	define( 'COLLEGE_NEXIS_THEME_VERSION', '1.0.0' );
}

if ( ! function_exists( 'collegenexis_theme_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function collegenexis_theme_setup() {
		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on College Nexis Theme, use a find and replace
		 * to change 'collegenexis-theme' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'collegenexis-theme', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus(
			array(
				'menu-1' => esc_html__( 'Primary Menu', 'collegenexis-theme' ),
				'footer-menu' => esc_html__( 'Footer Menu', 'collegenexis-theme' ),
			)
		);

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support(
			'html5',
			array(
				'search-form',
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
				'style',
				'script',
			)
		);

		// Set up the WordPress core custom background feature.
		add_theme_support(
			'custom-background',
			apply_filters(
				'collegenexis_theme_custom_background_args',
				array(
					'default-color' => 'ffffff',
					'default-image' => '',
				)
			)
		);

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support(
			'custom-logo',
			array(
				'height'      => 250,
				'width'       => 250,
				'flex-width'  => true,
				'flex-height' => true,
			)
		);

		// Add support for editor styles.
        add_theme_support( 'editor-styles' );

        // Enqueue editor styles.
        add_editor_style( 'style-editor.css' ); // You would create this file for block editor specific styles

		// Add support for responsive embedded content.
        add_theme_support( 'responsive-embeds' );

		// Add support for block styles.
		add_theme_support( 'wp-block-styles' );

	}
endif;
add_action( 'after_setup_theme', 'collegenexis_theme_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function collegenexis_theme_content_width() {
	// This variable is intended to be overruled from themes.
	// Open WPCS issue: {@link https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/issues/1043}.
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
	$GLOBALS['content_width'] = apply_filters( 'collegenexis_theme_content_width', 640 );
}
add_action( 'after_setup_theme', 'collegenexis_theme_content_width', 0 );

/**
 * Enqueue scripts and styles.
 */
function collegenexis_theme_scripts() {
	wp_enqueue_style( 'collegenexis-theme-style', get_stylesheet_uri(), array(), COLLEGE_NEXIS_THEME_VERSION );
	// wp_style_add_data( 'collegenexis-theme-style', 'rtl', 'replace' ); // If supporting RTL

	// You can enqueue more styles or scripts here
	// Example: wp_enqueue_style( 'collegenexis-theme-google-fonts', 'YOUR_GOOGLE_FONTS_URL', array(), null );
	// Example: wp_enqueue_script( 'collegenexis-theme-navigation', get_template_directory_uri() . '/js/navigation.js', array(), COLLEGE_NEXIS_THEME_VERSION, true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'collegenexis_theme_scripts' );

/**
 * Implement the Custom Header feature.
 */
// require get_template_directory() . '/inc/custom-header.php'; // Example if you add custom header features

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
// if ( defined( 'JETPACK__VERSION' ) ) { // Example if you add Jetpack support
// 	require get_template_directory() . '/inc/jetpack.php';
// }

/**
 * Load WooCommerce compatibility file.
 */
// if ( class_exists( 'WooCommerce' ) ) { // Example if you add WooCommerce support
// 	require get_template_directory() . '/inc/woocommerce.php';
// }

?>
