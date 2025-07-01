<?php
/**
 * Plugin Name: Contact Form 7 (Placeholder)
 * Description: A placeholder for Contact Form 7 to allow theme and plugin development.
 * Version: 1.0.0
 * Author: Takayuki Miyoshi (Simulated)
 */

// Simulate existence of key CF7 functions or shortcodes if needed
if (!function_exists('wpcf7_contact_form')) {
    function wpcf7_contact_form($id) {
        // error_log("Contact Form 7 Placeholder: wpcf7_contact_form function called for ID " . $id);
        return "[contact-form-7 id=\"{$id}\" title=\"Contact form 1 (Placeholder)\"]";
    }
}

if (!shortcode_exists('contact-form-7')) {
    add_shortcode('contact-form-7', 'cf7_placeholder_shortcode');
    function cf7_placeholder_shortcode($atts) {
        $id = isset($atts['id']) ? $atts['id'] : '0';
        // error_log("Contact Form 7 Placeholder: shortcode executed for ID " . $id);
        return "<div class='cf7-placeholder'>Contact Form 7 Placeholder (ID: {$id}) - In a real site, the form would appear here.</div>";
    }
}
