<?php
/**
 * Plugin Name: Advanced Custom Fields (Placeholder)
 * Description: A placeholder for ACF to allow theme and plugin development.
 * Version: 1.0.0
 * Author: ACF Team (Simulated)
 */

// Simulate existence of key ACF functions if needed for development
if (!function_exists('get_field')) {
    function get_field($selector, $post_id = false, $format_value = true) {
        // In a real scenario, this would fetch ACF data.
        // For placeholder, return null or a dummy value if specific tests need it.
        // error_log("ACF Placeholder: get_field called for " . $selector);
        return null;
    }
}

if (!function_exists('the_field')) {
    function the_field($selector, $post_id = false, $format_value = true) {
        // error_log("ACF Placeholder: the_field called for " . $selector);
        echo '';
    }
}

if (!class_exists('ACF')) {
    class ACF {
        public function __call($method, $args) {
            // error_log("ACF Placeholder: ACF class method called: " . $method);
            return null;
        }

        public static function __callStatic($method, $args) {
            // error_log("ACF Placeholder: ACF class static method called: " . $method);
            return null;
        }
    }
}

// Add other common ACF functions if your code relies on them during development
// For example: have_rows, the_row, get_sub_field, etc.

if (!function_exists('acf_add_options_page')) {
    function acf_add_options_page($args = array()) {
        // error_log("ACF Placeholder: acf_add_options_page called.");
        return false;
    }
}

if (!function_exists('acf_add_local_field_group')) {
    function acf_add_local_field_group($field_group) {
        // error_log("ACF Placeholder: acf_add_local_field_group called.");
        return true;
    }
}
