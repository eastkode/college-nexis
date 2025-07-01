<?php
/**
 * College Nexis Theme Customizer
 *
 * @package College_Nexis_Theme
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function collegenexis_theme_customize_register( $wp_customize ) {
	$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
	// $wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage'; // If using this

	if ( isset( $wp_customize->selective_refresh ) ) {
		$wp_customize->selective_refresh->add_partial(
			'blogname',
			array(
				'selector'        => '.site-title a',
				'render_callback' => 'collegenexis_theme_customize_partial_blogname',
			)
		);
		$wp_customize->selective_refresh->add_partial(
			'blogdescription',
			array(
				'selector'        => '.site-description',
				'render_callback' => 'collegenexis_theme_customize_partial_blogdescription',
			)
		);
	}

	// Theme Options Panel
	$wp_customize->add_panel('collegenexis_theme_options_panel', array(
        'title' => __('College Nexis Options', 'collegenexis-theme'),
        'priority' => 10, // Adjust priority as needed
        'capability' => 'edit_theme_options',
    ));

    // Colors Section
    $wp_customize->add_section('collegenexis_colors_section', array(
        'title' => __('Color Scheme', 'collegenexis-theme'),
        'panel' => 'collegenexis_theme_options_panel',
        'priority' => 10,
    ));

    // Primary Color Setting
    $wp_customize->add_setting('collegenexis_primary_color', array(
        'default' => '#0050A0', // Deep Blue
        'sanitize_callback' => 'sanitize_hex_color',
        'transport' => 'refresh', // or 'postMessage' with JS handling
    ));
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'collegenexis_primary_color_control', array(
        'label' => __('Primary Color', 'collegenexis-theme'),
        'section' => 'collegenexis_colors_section',
        'settings' => 'collegenexis_primary_color',
    )));

    // Accent Color Setting
    $wp_customize->add_setting('collegenexis_accent_color', array(
        'default' => '#FFD700', // Gold
        'sanitize_callback' => 'sanitize_hex_color',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'collegenexis_accent_color_control', array(
        'label' => __('Accent Color', 'collegenexis-theme'),
        'section' => 'collegenexis_colors_section',
        'settings' => 'collegenexis_accent_color',
    )));

    // Fonts Section
    $wp_customize->add_section('collegenexis_fonts_section', array(
        'title' => __('Typography', 'collegenexis-theme'),
        'panel' => 'collegenexis_theme_options_panel',
        'priority' => 20,
    ));

    // Heading Font Setting
    $wp_customize->add_setting('collegenexis_heading_font', array(
        'default' => 'Montserrat',
        'sanitize_callback' => 'collegenexis_sanitize_font_choice',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control('collegenexis_heading_font_control', array(
        'label' => __('Heading Font', 'collegenexis-theme'),
        'section' => 'collegenexis_fonts_section',
        'settings' => 'collegenexis_heading_font',
        'type' => 'select',
        'choices' => array(
            'Montserrat' => 'Montserrat',
            'Lato' => 'Lato',
            'Open Sans' => 'Open Sans',
            'Roboto' => 'Roboto',
            'Nunito' => 'Nunito',
            'Poppins' => 'Poppins',
            'Merriweather' => 'Merriweather', // A serif option
        ),
    ));

    // Body Font Setting
    $wp_customize->add_setting('collegenexis_body_font', array(
        'default' => 'Lato',
        'sanitize_callback' => 'collegenexis_sanitize_font_choice',
        'transport' => 'refresh',
    ));
    $wp_customize->add_control('collegenexis_body_font_control', array(
        'label' => __('Body Font', 'collegenexis-theme'),
        'section' => 'collegenexis_fonts_section',
        'settings' => 'collegenexis_body_font',
        'type' => 'select',
        'choices' => array(
            'Lato' => 'Lato',
            'Open Sans' => 'Open Sans',
            'Roboto' => 'Roboto',
            'Nunito' => 'Nunito',
            'Montserrat' => 'Montserrat',
            'Source Sans Pro' => 'Source Sans Pro',
            'Merriweather' => 'Merriweather',
        ),
    ));

}
add_action( 'customize_register', 'collegenexis_theme_customize_register' );

/**
 * Sanitize font choice.
 *
 * @param string $input The input font.
 * @return string Sanitized font choice.
 */
function collegenexis_sanitize_font_choice( $input ) {
    $valid_fonts = array(
        'Montserrat', 'Lato', 'Open Sans', 'Roboto', 'Nunito', 'Poppins', 'Merriweather', 'Source Sans Pro'
    );
    if ( in_array( $input, $valid_fonts, true ) ) {
        return $input;
    }
    return 'Lato'; // Default fallback
}


/**
 * Render the site title for the selective refresh partial.
 *
 * @return void
 */
function collegenexis_theme_customize_partial_blogname() {
	bloginfo( 'name' );
}

/**
 * Render the site tagline for the selective refresh partial.
 *
 * @return void
 */
function collegenexis_theme_customize_partial_blogdescription() {
	bloginfo( 'description' );
}

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function collegenexis_theme_customize_preview_js() {
	wp_enqueue_script( 'collegenexis-theme-customizer', get_template_directory_uri() . '/js/customizer.js', array( 'customize-preview' ), COLLEGE_NEXIS_THEME_VERSION, true );
}
add_action( 'customize_preview_init', 'collegenexis_theme_customize_preview_js' );


/**
 * Enqueue Google Fonts and output CSS for customizer options.
 */
function collegenexis_theme_customizer_css() {
    $primary_color = get_theme_mod( 'collegenexis_primary_color', '#0050A0' );
    $accent_color = get_theme_mod( 'collegenexis_accent_color', '#FFD700' );
    $heading_font = get_theme_mod( 'collegenexis_heading_font', 'Montserrat' );
    $body_font = get_theme_mod( 'collegenexis_body_font', 'Lato' );

    // Enqueue Google Fonts
    $font_families = array();
    if ( $heading_font && $heading_font !== 'System Default' ) $font_families[] = $heading_font . ':400,700'; // Weights
    if ( $body_font && $body_font !== 'System Default' ) $font_families[] = $body_font . ':400,400i,700'; // Weights

    if ( count( $font_families ) > 0 ) {
        $query_args = array(
            'family' => urlencode( implode( '|', array_unique( $font_families ) ) ),
            'subset' => urlencode( 'latin,latin-ext' ), // Adjust as needed
            'display' => 'swap',
        );
        $fonts_url = add_query_arg( $query_args, 'https://fonts.googleapis.com/css' );
        wp_enqueue_style( 'collegenexis-theme-google-fonts', $fonts_url, array(), null );
    }

    // Customizer CSS
    $custom_css = "
        :root {
            --cn-primary-color: {$primary_color};
            --cn-accent-color: {$accent_color};
            --cn-heading-font: '{$heading_font}', sans-serif;
            --cn-body-font: '{$body_font}', sans-serif;
        }

        body {
            font-family: var(--cn-body-font);
            color: #333; /* Example body text color */
        }
        h1, h2, h3, h4, h5, h6 {
            font-family: var(--cn-heading-font);
            color: var(--cn-primary-color); /* Example: Headings use primary color */
        }
        a {
            color: var(--cn-primary-color);
        }
        a:hover, a:focus {
            color: var(--cn-accent-color);
        }

        /* Example usage of accent color */
        button, input[type='submit'], .button, .wp-block-button__link {
            background-color: var(--cn-primary-color);
            color: #fff;
            border: 1px solid var(--cn-primary-color);
        }
        button:hover, input[type='submit']:hover, .button:hover, .wp-block-button__link:hover {
            background-color: var(--cn-accent-color);
            border-color: var(--cn-accent-color);
            color: #333;
        }

        /* Specific theme elements */
        .site-header {
             /* background-color: var(--cn-primary-color); Example */
             /* color: #fff; */
        }
        .site-title a {
            /* color: #fff; */
        }
        .main-navigation a {
            /* color: #fff; */
        }
        .main-navigation a:hover {
            /* color: var(--cn-accent-color); */
        }

        /* Add more specific rules as needed */
    ";
    wp_add_inline_style( 'collegenexis-theme-style', $custom_css ); // Enqueue after main stylesheet
}
add_action( 'wp_enqueue_scripts', 'collegenexis_theme_customizer_css' );
