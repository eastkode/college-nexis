<?php
/**
 * Plugin Name:       College Nexis Core Functionality
 * Plugin URI:        https://collegenexis.com/
 * Description:       Handles core functionalities for College Nexis site including Custom Post Types (Colleges, Courses, Roadmaps, Exam Updates), taxonomies, and other specific features.
 * Version:           1.0.0
 * Author:            Manas Ranjan Bisi
 * Author URI:        https://collegenexis.com/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       collegenexis-core
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'COLLEGENEXIS_CORE_VERSION', '1.0.0' );
define( 'COLLEGENEXIS_CORE_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'COLLEGENEXIS_CORE_PLUGIN_URL', plugin_dir_url( __FILE__ ) );


/**
 * Register Custom Post Types.
 */
function collegenexis_core_register_post_types() {
	// College CPT
	$college_labels = array(
		'name'                  => _x( 'Colleges', 'Post type general name', 'collegenexis-core' ),
		'singular_name'         => _x( 'College', 'Post type singular name', 'collegenexis-core' ),
		'menu_name'             => _x( 'Colleges', 'Admin Menu text', 'collegenexis-core' ),
		'name_admin_bar'        => _x( 'College', 'Add New on Toolbar', 'collegenexis-core' ),
		'add_new'               => __( 'Add New', 'collegenexis-core' ),
		'add_new_item'          => __( 'Add New College', 'collegenexis-core' ),
		'new_item'              => __( 'New College', 'collegenexis-core' ),
		'edit_item'             => __( 'Edit College', 'collegenexis-core' ),
		'view_item'             => __( 'View College', 'collegenexis-core' ),
		'all_items'             => __( 'All Colleges', 'collegenexis-core' ),
		'search_items'          => __( 'Search Colleges', 'collegenexis-core' ),
		'parent_item_colon'     => __( 'Parent Colleges:', 'collegenexis-core' ),
		'not_found'             => __( 'No colleges found.', 'collegenexis-core' ),
		'not_found_in_trash'    => __( 'No colleges found in Trash.', 'collegenexis-core' ),
		'featured_image'        => _x( 'College Logo', 'Overrides the “Featured Image” phrase for this post type. Added in 4.3', 'collegenexis-core' ),
		'set_featured_image'    => _x( 'Set college logo', 'Overrides the “Set featured image” phrase for this post type. Added in 4.3', 'collegenexis-core' ),
		'remove_featured_image' => _x( 'Remove college logo', 'Overrides the “Remove featured image” phrase for this post type. Added in 4.3', 'collegenexis-core' ),
		'use_featured_image'    => _x( 'Use as college logo', 'Overrides the “Use as featured image” phrase for this post type. Added in 4.3', 'collegenexis-core' ),
		'archives'              => _x( 'College archives', 'The post type archive label used in nav menus. Default “Post Archives”. Added in 4.4', 'collegenexis-core' ),
		'insert_into_item'      => _x( 'Insert into college', 'Overrides the “Insert into post”/”Insert into page” phrase (used when inserting media into a post). Added in 4.4', 'collegenexis-core' ),
		'uploaded_to_this_item' => _x( 'Uploaded to this college', 'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase (used when viewing media attached to a post). Added in 4.4', 'collegenexis-core' ),
		'filter_items_list'     => _x( 'Filter colleges list', 'Screen reader text for the filter links heading on the post type listing screen. Default “Filter posts list”/”Filter pages list”. Added in 4.4', 'collegenexis-core' ),
		'items_list_navigation' => _x( 'Colleges list navigation', 'Screen reader text for the pagination heading on the post type listing screen. Default “Posts list navigation”/”Pages list navigation”. Added in 4.4', 'collegenexis-core' ),
		'items_list'            => _x( 'Colleges list', 'Screen reader text for the items list heading on the post type listing screen. Default “Posts list”/”Pages list”. Added in 4.4', 'collegenexis-core' ),
	);
	$college_args = array(
		'labels'             => $college_labels,
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => array( 'slug' => 'colleges' ),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => null,
		'supports'           => array( 'title', 'editor', 'thumbnail', 'custom-fields', 'excerpt', 'revisions' ),
		'menu_icon'          => 'dashicons-building',
        'show_in_rest'       => true, // For Gutenberg support
	);
	register_post_type( 'college', $college_args );

	// Course CPT
	$course_labels = array(
		'name'                  => _x( 'Courses', 'Post type general name', 'collegenexis-core' ),
		'singular_name'         => _x( 'Course', 'Post type singular name', 'collegenexis-core' ),
		'menu_name'             => _x( 'Courses', 'Admin Menu text', 'collegenexis-core' ),
		'name_admin_bar'        => _x( 'Course', 'Add New on Toolbar', 'collegenexis-core' ),
		'add_new'               => __( 'Add New', 'collegenexis-core' ),
		'add_new_item'          => __( 'Add New Course', 'collegenexis-core' ),
		'new_item'              => __( 'New Course', 'collegenexis-core' ),
		'edit_item'             => __( 'Edit Course', 'collegenexis-core' ),
		'view_item'             => __( 'View Course', 'collegenexis-core' ),
		'all_items'             => __( 'All Courses', 'collegenexis-core' ),
		'search_items'          => __( 'Search Courses', 'collegenexis-core' ),
		'parent_item_colon'     => __( 'Parent Courses:', 'collegenexis-core' ),
		'not_found'             => __( 'No courses found.', 'collegenexis-core' ),
		'not_found_in_trash'    => __( 'No courses found in Trash.', 'collegenexis-core' ),
		'featured_image'        => _x( 'Course Image', 'Overrides the “Featured Image” phrase for this post type.', 'collegenexis-core' ),
		'set_featured_image'    => _x( 'Set course image', 'Overrides the “Set featured image” phrase for this post type.', 'collegenexis-core' ),
		'remove_featured_image' => _x( 'Remove course image', 'Overrides the “Remove featured image” phrase for this post type.', 'collegenexis-core' ),
		'use_featured_image'    => _x( 'Use as course image', 'Overrides the “Use as featured image” phrase for this post type.', 'collegenexis-core' ),
		'archives'              => _x( 'Course archives', 'The post type archive label used in nav menus.', 'collegenexis-core' ),
		'insert_into_item'      => _x( 'Insert into course', 'Overrides the “Insert into post”/”Insert into page” phrase.', 'collegenexis-core' ),
		'uploaded_to_this_item' => _x( 'Uploaded to this course', 'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase.', 'collegenexis-core' ),
		'filter_items_list'     => _x( 'Filter courses list', 'Screen reader text for the filter links heading on the post type listing screen.', 'collegenexis-core' ),
		'items_list_navigation' => _x( 'Courses list navigation', 'Screen reader text for the pagination heading on the post type listing screen.', 'collegenexis-core' ),
		'items_list'            => _x( 'Courses list', 'Screen reader text for the items list heading on the post type listing screen.', 'collegenexis-core' ),
	);
	$course_args = array(
		'labels'             => $course_labels,
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => array( 'slug' => 'courses' ),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => null,
		'supports'           => array( 'title', 'editor', 'thumbnail', 'custom-fields', 'excerpt', 'revisions' ),
		'menu_icon'          => 'dashicons-welcome-learn-more',
        'show_in_rest'       => true,
	);
	register_post_type( 'course', $course_args );

	// Career Roadmap CPT
	$roadmap_labels = array(
		'name'                  => _x( 'Career Roadmaps', 'Post type general name', 'collegenexis-core' ),
		'singular_name'         => _x( 'Career Roadmap', 'Post type singular name', 'collegenexis-core' ),
		'menu_name'             => _x( 'Roadmaps', 'Admin Menu text', 'collegenexis-core' ),
		'name_admin_bar'        => _x( 'Roadmap', 'Add New on Toolbar', 'collegenexis-core' ),
		'add_new'               => __( 'Add New', 'collegenexis-core' ),
		'add_new_item'          => __( 'Add New Roadmap', 'collegenexis-core' ),
		'new_item'              => __( 'New Roadmap', 'collegenexis-core' ),
		'edit_item'             => __( 'Edit Roadmap', 'collegenexis-core' ),
		'view_item'             => __( 'View Roadmap', 'collegenexis-core' ),
		'all_items'             => __( 'All Roadmaps', 'collegenexis-core' ),
		'search_items'          => __( 'Search Roadmaps', 'collegenexis-core' ),
		'not_found'             => __( 'No roadmaps found.', 'collegenexis-core' ),
		'not_found_in_trash'    => __( 'No roadmaps found in Trash.', 'collegenexis-core' ),
		'featured_image'        => _x( 'Roadmap Image', 'Overrides the “Featured Image” phrase for this post type.', 'collegenexis-core' ),
		'set_featured_image'    => _x( 'Set roadmap image', 'Overrides the “Set featured image” phrase for this post type.', 'collegenexis-core' ),
		'remove_featured_image' => _x( 'Remove roadmap image', 'Overrides the “Remove featured image” phrase for this post type.', 'collegenexis-core' ),
		'use_featured_image'    => _x( 'Use as roadmap image', 'Overrides the “Use as featured image” phrase for this post type.', 'collegenexis-core' ),
		'archives'              => _x( 'Roadmap archives', 'The post type archive label used in nav menus.', 'collegenexis-core' ),
		'insert_into_item'      => _x( 'Insert into roadmap', 'Overrides the “Insert into post”/”Insert into page” phrase.', 'collegenexis-core' ),
		'uploaded_to_this_item' => _x( 'Uploaded to this roadmap', 'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase.', 'collegenexis-core' ),
		'filter_items_list'     => _x( 'Filter roadmaps list', 'Screen reader text for the filter links heading on the post type listing screen.', 'collegenexis-core' ),
		'items_list_navigation' => _x( 'Roadmaps list navigation', 'Screen reader text for the pagination heading on the post type listing screen.', 'collegenexis-core' ),
		'items_list'            => _x( 'Roadmaps list', 'Screen reader text for the items list heading on the post type listing screen.', 'collegenexis-core' ),
	);
	$roadmap_args = array(
		'labels'             => $roadmap_labels,
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => array( 'slug' => 'roadmaps' ),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => null,
		'supports'           => array( 'title', 'editor', 'thumbnail', 'custom-fields', 'revisions' ),
		'menu_icon'          => 'dashicons-chart-line',
        'show_in_rest'       => true,
	);
	register_post_type( 'roadmap', $roadmap_args );

	// Exam Updates CPT
	$exam_update_labels = array(
		'name'                  => _x( 'Exam Updates', 'Post type general name', 'collegenexis-core' ),
		'singular_name'         => _x( 'Exam Update', 'Post type singular name', 'collegenexis-core' ),
		'menu_name'             => _x( 'Exam Updates', 'Admin Menu text', 'collegenexis-core' ),
		'name_admin_bar'        => _x( 'Exam Update', 'Add New on Toolbar', 'collegenexis-core' ),
		'add_new'               => __( 'Add New', 'collegenexis-core' ),
		'add_new_item'          => __( 'Add New Exam Update', 'collegenexis-core' ),
		'new_item'              => __( 'New Exam Update', 'collegenexis-core' ),
		'edit_item'             => __( 'Edit Exam Update', 'collegenexis-core' ),
		'view_item'             => __( 'View Exam Update', 'collegenexis-core' ),
		'all_items'             => __( 'All Exam Updates', 'collegenexis-core' ),
		'search_items'          => __( 'Search Exam Updates', 'collegenexis-core' ),
		'not_found'             => __( 'No exam updates found.', 'collegenexis-core' ),
		'not_found_in_trash'    => __( 'No exam updates found in Trash.', 'collegenexis-core' ),
		'archives'              => _x( 'Exam Update archives', 'The post type archive label used in nav menus.', 'collegenexis-core' ),
		'insert_into_item'      => _x( 'Insert into exam update', 'Overrides the “Insert into post”/”Insert into page” phrase.', 'collegenexis-core' ),
		'uploaded_to_this_item' => _x( 'Uploaded to this exam update', 'Overrides the “Uploaded to this post”/”Uploaded to this page” phrase.', 'collegenexis-core' ),
		'filter_items_list'     => _x( 'Filter exam updates list', 'Screen reader text for the filter links heading on the post type listing screen.', 'collegenexis-core' ),
		'items_list_navigation' => _x( 'Exam Updates list navigation', 'Screen reader text for the pagination heading on the post type listing screen.', 'collegenexis-core' ),
		'items_list'            => _x( 'Exam Updates list', 'Screen reader text for the items list heading on the post type listing screen.', 'collegenexis-core' ),
	);
	$exam_update_args = array(
		'labels'             => $exam_update_labels,
		'public'             => true,
		'publicly_queryable' => true,
		'show_ui'            => true,
		'show_in_menu'       => true,
		'query_var'          => true,
		'rewrite'            => array( 'slug' => 'exam-updates' ),
		'capability_type'    => 'post',
		'has_archive'        => true,
		'hierarchical'       => false,
		'menu_position'      => null,
		'supports'           => array( 'title', 'editor', 'custom-fields', 'revisions' ),
		'menu_icon'          => 'dashicons-bell',
        'show_in_rest'       => true,
	);
	register_post_type( 'exam_update', $exam_update_args );
}
add_action( 'init', 'collegenexis_core_register_post_types' );


/**
 * Register Custom Taxonomies.
 */
function collegenexis_core_register_taxonomies() {
    // College Type Taxonomy (for Colleges CPT)
    $college_type_labels = array(
        'name'              => _x( 'College Types', 'taxonomy general name', 'collegenexis-core' ),
        'singular_name'     => _x( 'College Type', 'taxonomy singular name', 'collegenexis-core' ),
        'search_items'      => __( 'Search College Types', 'collegenexis-core' ),
        'all_items'         => __( 'All College Types', 'collegenexis-core' ),
        'parent_item'       => __( 'Parent College Type', 'collegenexis-core' ),
        'parent_item_colon' => __( 'Parent College Type:', 'collegenexis-core' ),
        'edit_item'         => __( 'Edit College Type', 'collegenexis-core' ),
        'update_item'       => __( 'Update College Type', 'collegenexis-core' ),
        'add_new_item'      => __( 'Add New College Type', 'collegenexis-core' ),
        'new_item_name'     => __( 'New College Type Name', 'collegenexis-core' ),
        'menu_name'         => __( 'College Types', 'collegenexis-core' ),
    );
    $college_type_args = array(
        'hierarchical'      => true,
        'labels'            => $college_type_labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array( 'slug' => 'college-type' ),
        'show_in_rest'      => true, // For Gutenberg support
    );
    register_taxonomy( 'college_type', array( 'college' ), $college_type_args );

    // Course Category Taxonomy (for Courses CPT)
    $course_category_labels = array(
        'name'              => _x( 'Course Categories', 'taxonomy general name', 'collegenexis-core' ),
        'singular_name'     => _x( 'Course Category', 'taxonomy singular name', 'collegenexis-core' ),
        'search_items'      => __( 'Search Course Categories', 'collegenexis-core' ),
        'all_items'         => __( 'All Course Categories', 'collegenexis-core' ),
        'parent_item'       => __( 'Parent Course Category', 'collegenexis-core' ),
        'parent_item_colon' => __( 'Parent Course Category:', 'collegenexis-core' ),
        'edit_item'         => __( 'Edit Course Category', 'collegenexis-core' ),
        'update_item'       => __( 'Update Course Category', 'collegenexis-core' ),
        'add_new_item'      => __( 'Add New Course Category', 'collegenexis-core' ),
        'new_item_name'     => __( 'New Course Category Name', 'collegenexis-core' ),
        'menu_name'         => __( 'Course Categories', 'collegenexis-core' ),
    );
    $course_category_args = array(
        'hierarchical'      => true,
        'labels'            => $course_category_labels,
        'show_ui'           => true,
        'show_admin_column' => true,
        'query_var'         => true,
        'rewrite'           => array( 'slug' => 'course-category' ),
        'show_in_rest'      => true,
    );
    register_taxonomy( 'course_category', array( 'course' ), $course_category_args );

    // You can add more taxonomies here:
    // - Location (City, State) for Colleges (could be hierarchical or separate)
    // - Exam Type for Exam Updates
    // - Career Field for Roadmaps
}
add_action( 'init', 'collegenexis_core_register_taxonomies' );


/**
 * Plugin Activation Hook: Create pages.
 */
function collegenexis_core_activate() {
    // Ensure CPTs are registered before trying to create pages or flush rewrite rules.
    collegenexis_core_register_post_types();
    collegenexis_core_register_taxonomies();

    // Page titles and slugs
    $pages = array(
        'home'          => array( 'title' => 'Home', 'content' => '<!-- wp:paragraph --><p>Welcome to College Nexis! Your smart companion to discover the right college, plan the right course, and build the right career — beautifully, clearly, and stress-free.</p><!-- /wp:paragraph --> <!-- wp:search {"label":"Search Colleges, Courses, Careers","showLabel":false,"placeholder":"Search Colleges, Courses, Careers...","width":100,"widthUnit":"%","buttonText":"Search","buttonPosition":"button-inside","buttonUseIcon":true} /-->' ),
        'colleges'      => array( 'title' => 'Colleges', 'content' => '<!-- wp:paragraph --><p>Find detailed profiles of colleges. Use the filters to narrow down your search.</p><!-- /wp:paragraph --> <!-- wp:shortcode -->[college_archive_placeholder]<!-- /wp:shortcode -->' ),
        'courses'       => array( 'title' => 'Courses', 'content' => '<!-- wp:paragraph --><p>Explore various courses, understand their scope, and find colleges offering them.</p><!-- /wp:paragraph --> <!-- wp:shortcode -->[course_archive_placeholder]<!-- /wp:shortcode -->' ),
        'roadmaps'      => array( 'title' => 'Career Roadmaps', 'content' => '<!-- wp:paragraph --><p>Discover step-by-step career roadmaps to guide your journey.</p><!-- /wp:paragraph --> <!-- wp:shortcode -->[roadmap_archive_placeholder]<!-- /wp:shortcode -->' ),
        'blog'          => array( 'title' => 'Blog', 'content' => '<!-- wp:paragraph --><p>Latest articles on career advice, exam preparation, success stories, and education trends.</p><!-- /wp:paragraph -->' ), // Content will be posts
        'exam-updates'  => array( 'title' => 'Exam Updates', 'content' => '<!-- wp:paragraph --><p>Stay updated with the latest government exams, result announcements, and education news.</p><!-- /wp:paragraph --> <!-- wp:shortcode -->[exam_update_archive_placeholder]<!-- /wp:shortcode -->' ),
        'contact'       => array( 'title' => 'Contact Us', 'content' => '<!-- wp:paragraph --><p>Get in touch with us. We are here to help!</p><!-- /wp:paragraph --> <!-- wp:shortcode -->[contact_form_placeholder id="123" title="Contact Us Form"]<!-- /wp:shortcode -->' ),
        'login-register'=> array( 'title' => 'Login/Register', 'content' => '<!-- wp:paragraph --><p>Login to access your saved favorites or register for an account.</p><!-- /wp:paragraph --> <!-- wp:shortcode -->[login_register_placeholder]<!-- /wp:shortcode -->' ),
    );

    foreach ( $pages as $slug => $page ) {
        $page_data = array(
            'post_title'    => $page['title'],
            'post_content'  => $page['content'],
            'post_status'   => 'publish',
            'post_type'     => 'page',
            'post_name'     => $slug,
            'comment_status'=> 'closed',
            'ping_status'   => 'closed',
        );

        // Check if page exists
        $existing_page = get_page_by_path( $slug );
        if ( ! $existing_page ) {
            $page_id = wp_insert_post( $page_data );
            // Optional: Assign page templates here if they exist and are needed
            // if ($slug === 'contact') {
            // update_post_meta($page_id, '_wp_page_template', 'template-contact.php');
            // }
        }
    }

    // Set static front page and posts page
    $home_page = get_page_by_path( 'home' );
    $blog_page = get_page_by_path( 'blog' );

    if ( $home_page && $home_page->ID ) {
        update_option( 'show_on_front', 'page' );
        update_option( 'page_on_front', $home_page->ID );
    }
    if ( $blog_page && $blog_page->ID ) {
        update_option( 'page_for_posts', $blog_page->ID );
    }

    // Flush rewrite rules after CPTs and pages are created.
    flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'collegenexis_core_activate' );


/**
 * Plugin Deactivation Hook.
 */
function collegenexis_core_deactivate() {
	// Flush rewrite rules to remove CPT and taxonomy rules.
	flush_rewrite_rules();
    // Consider if you want to remove the pages on deactivation or leave them.
    // For this project, we'll leave them.
}
register_deactivation_hook( __FILE__, 'collegenexis_core_deactivate' );


/**
 * Placeholder shortcodes for archive pages and forms.
 * These would be replaced by actual archive template logic or form plugin shortcodes.
 */
function cn_placeholder_shortcode_handler($atts, $content = null, $tag = '') {
    $output = "<!-- Placeholder for [{$tag}] ";
    if (!empty($atts)) {
        foreach($atts as $key => $value) {
            $output .= "{$key}=\"{$value}\" ";
        }
    }
    $output .= "-->";
    $output .= "<div style='border: 2px dashed #ccc; padding: 20px; text-align: center; margin: 20px 0;'>";
    $output .= "<strong>Content for [{$tag}] will appear here.</strong><br>";
    if($tag === 'contact_form_placeholder'){
        $output .= "This would be a contact form.";
    } else if ($tag === 'login_register_placeholder') {
        $output .= "This would be a login/registration form or links.";
    } else {
        $output .= "This area will display an archive of " . str_replace('_archive_placeholder', '', $tag) . "s.";
    }
    $output .= "</div>";
    return $output;
}
add_shortcode('college_archive_placeholder', 'cn_placeholder_shortcode_handler');
add_shortcode('course_archive_placeholder', 'cn_placeholder_shortcode_handler');
add_shortcode('roadmap_archive_placeholder', 'cn_placeholder_shortcode_handler');
add_shortcode('exam_update_archive_placeholder', 'cn_placeholder_shortcode_handler');
add_shortcode('contact_form_placeholder', 'cn_placeholder_shortcode_handler'); // Will be replaced by actual form plugin
add_shortcode('login_register_placeholder', 'cn_placeholder_shortcode_handler'); // May be replaced by membership plugin


// TODO: Add any other core functionalities:
// - Helper functions
// - Integration with other plugins (e.g., ACF specific logic if not handled by ACF itself)
// - Admin columns customizations for CPTs
// - Custom meta boxes (if not using ACF for everything)

/**
 * Load plugin textdomain.
 */
function collegenexis_core_load_textdomain() {
    load_plugin_textdomain( 'collegenexis-core', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_action( 'plugins_loaded', 'collegenexis_core_load_textdomain' );


/**
 * Include ACF PHP field group definitions.
 * ACF will automatically detect and register field groups defined in PHP files
 * within a folder named 'acf-php' inside the plugin or theme.
 *
 * Alternatively, you can explicitly include them:
 */
add_action('acf/init', 'collegenexis_core_include_acf_php_definitions');
function collegenexis_core_include_acf_php_definitions() {
    // Check if ACF is active
    if ( !function_exists('acf_add_local_field_group') ) {
        return;
    }

    $acf_php_path = COLLEGENEXIS_CORE_PLUGIN_DIR . 'acf-php/';

    // Include all .php files from the acf-php directory
    if (is_dir($acf_php_path)) {
        foreach (glob($acf_php_path . '*.php') as $file) {
            include_once $file;
        }
    }
}

/**
 * Optional: Point ACF JSON to a local directory for sync.
 * This is good practice for team development and version control.
 * Field groups can be created in the UI, synced to JSON, then exported to PHP.
 */
// add_filter('acf/settings/save_json', 'collegenexis_core_acf_json_save_point');
// function collegenexis_core_acf_json_save_point( $path ) {
//     $path = COLLEGENEXIS_CORE_PLUGIN_DIR . 'acf-json-local'; // Create this folder
//     return $path;
// }

// add_filter('acf/settings/load_json', 'collegenexis_core_acf_json_load_point');
// function collegenexis_core_acf_json_load_point( $paths ) {
//     unset($paths[0]); // Removes default acf-json folder in theme
//     $paths[] = COLLEGENEXIS_CORE_PLUGIN_DIR . 'acf-json-local';
//     return $paths;
// }



// College Admin Columns
// =====================

// Add custom columns to the college post type listing
add_filter( 'manage_college_posts_columns', 'collegenexis_core_set_college_columns' );
function collegenexis_core_set_college_columns( $columns ) {
    $new_columns = array();
    $new_columns['cb'] = $columns['cb'];
    $new_columns['title'] = $columns['title']; // College Name
    $new_columns['college_logo'] = __( 'Logo', 'collegenexis-core' );
    $new_columns['college_city'] = __( 'City', 'collegenexis-core' );
    $new_columns['college_state'] = __( 'State', 'collegenexis-core' );
    $new_columns['college_est_year'] = __( 'Estd. Year', 'collegenexis-core' );
    $new_columns['taxonomy-college_type'] = __( 'Category', 'collegenexis-core' ); // Default taxonomy column
    $new_columns['date'] = $columns['date'];
    return $new_columns;
}

// Populate the custom columns for the college post type
add_action( 'manage_college_posts_custom_column', 'collegenexis_core_college_custom_column_content', 10, 2 );
function collegenexis_core_college_custom_column_content( $column, $post_id ) {
    switch ( $column ) {
        case 'college_logo':
            $logo_data = get_field( 'college_logo_image', $post_id );
            if ( $logo_data && isset($logo_data['sizes']['thumbnail']) ) {
                echo '<img src="' . esc_url( $logo_data['sizes']['thumbnail'] ) . '" alt="' . esc_attr( $logo_data['alt'] ) . '" style="width: 60px; height: auto;" />';
            } elseif ( has_post_thumbnail( $post_id ) ) {
                echo get_the_post_thumbnail( $post_id, array(60, 60) );
            } else {
                echo '—';
            }
            break;
        case 'college_city':
            $city = get_field( 'college_city', $post_id );
            echo $city ? esc_html( $city ) : '—';
            break;
        case 'college_state':
            $state = get_field( 'college_state', $post_id );
            echo $state ? esc_html( $state ) : '—';
            break;
        case 'college_est_year':
            $year = get_field( 'college_establishment_year', $post_id );
            echo $year ? esc_html( $year ) : '—';
            break;
    }
}

// Make custom college columns sortable
add_filter( 'manage_edit-college_sortable_columns', 'collegenexis_core_make_college_columns_sortable' );
function collegenexis_core_make_college_columns_sortable( $columns ) {
    $columns['college_city'] = 'college_city';
    $columns['college_state'] = 'college_state';
    $columns['college_est_year'] = 'college_establishment_year';
    $columns['taxonomy-college_type'] = 'taxonomy-college_type';
    return $columns;
}

// Handle sorting for custom college columns
add_action( 'pre_get_posts', 'collegenexis_core_college_custom_orderby' );
function collegenexis_core_college_custom_orderby( $query ) {
    if ( ! is_admin() || ! $query->is_main_query() ) {
        return;
    }

    $orderby = $query->get( 'orderby' );
    if ( 'college_city' === $orderby ) {
        $query->set( 'meta_key', 'college_city' );
        $query->set( 'orderby', 'meta_value' );
    } elseif ( 'college_state' === $orderby ) {
        $query->set( 'meta_key', 'college_state' );
        $query->set( 'orderby', 'meta_value' );
    } elseif ( 'college_establishment_year' === $orderby ) {
        $query->set( 'meta_key', 'college_establishment_year' );
        $query->set( 'orderby', 'meta_value_num' ); // Sort numerically
    }
}


// Course Admin Columns
// ====================

// Add custom columns to the course post type listing
add_filter( 'manage_course_posts_columns', 'collegenexis_core_set_course_columns' );
function collegenexis_core_set_course_columns( $columns ) {
    $new_columns = array();
    $new_columns['cb'] = $columns['cb'];
    $new_columns['title'] = $columns['title']; // Course Name
    $new_columns['course_icon'] = __( 'Icon', 'collegenexis-core' );
    $new_columns['taxonomy-course_category'] = __( 'Category', 'collegenexis-core' );
    $new_columns['course_duration'] = __( 'Duration', 'collegenexis-core' );
    $new_columns['date'] = $columns['date'];
    return $new_columns;
}

// Populate the custom columns for the course post type
add_action( 'manage_course_posts_custom_column', 'collegenexis_core_course_custom_column_content', 10, 2 );
function collegenexis_core_course_custom_column_content( $column, $post_id ) {
    switch ( $column ) {
        case 'course_icon':
            $icon_data = get_field( 'course_icon', $post_id );
            if ( $icon_data && isset($icon_data['sizes']['thumbnail']) ) {
                echo '<img src="' . esc_url( $icon_data['sizes']['thumbnail'] ) . '" alt="' . esc_attr( $icon_data['alt'] ) . '" style="width: 50px; height: auto;" />';
            } else {
                echo '—';
            }
            break;
        case 'course_duration':
            $duration = get_field( 'course_duration_details', $post_id );
            echo $duration ? esc_html( $duration ) : '—';
            break;
    }
}

// Make custom course columns sortable
add_filter( 'manage_edit-course_sortable_columns', 'collegenexis_core_make_course_columns_sortable' );
function collegenexis_core_make_course_columns_sortable( $columns ) {
    $columns['taxonomy-course_category'] = 'taxonomy-course_category';
    $columns['course_duration'] = 'course_duration_details';
    return $columns;
}

// Handle sorting for custom course columns
add_action( 'pre_get_posts', 'collegenexis_core_course_custom_orderby' );
function collegenexis_core_course_custom_orderby( $query ) {
    if ( ! is_admin() || ! $query->is_main_query() ) {
        return;
    }

    $orderby = $query->get( 'orderby' );
    if ( 'course_duration_details' === $orderby ) {
        $query->set( 'meta_key', 'course_duration_details' );
        $query->set( 'orderby', 'meta_value' );
    }
}


// Add admin filters for taxonomies (WordPress does this by default if show_admin_column is true for the taxonomy)
// However, if we want to filter by custom fields, we'd need more complex additions.
// For now, relying on default taxonomy filters which are enabled by `show_admin_column = true`
// in `collegenexis_core_register_taxonomies`.

=======

// End of plugin file
?>
