<?php
/**
 * ACF Field Groups for College CPT
 */
if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array(
	'key' => 'group_college_details',
	'title' => 'College Details',
	'fields' => array(
		array(
			'key' => 'field_college_location_tab',
			'label' => 'Location & Contact',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		),
		array(
			'key' => 'field_college_address',
			'label' => 'Full Address',
			'name' => 'college_address',
			'type' => 'textarea',
			'instructions' => 'Enter the full address of the college.',
			'required' => 0,
		),
		array(
			'key' => 'field_college_city',
			'label' => 'City',
			'name' => 'college_city',
			'type' => 'text',
		),
		array(
			'key' => 'field_college_state',
			'label' => 'State',
			'name' => 'college_state',
			'type' => 'text',
		),
		array(
			'key' => 'field_college_pin_code',
			'label' => 'Pin Code',
			'name' => 'college_pin_code',
			'type' => 'text',
		),
		array(
			'key' => 'field_college_google_map',
			'label' => 'Google Map Location',
			'name' => 'college_google_map',
			'type' => 'google_map', // ACF Pro field
			'instructions' => 'Search for the college location.',
			'center_lat' => '',
			'center_lng' => '',
			'zoom' => '',
			'height' => '',
		),
		array(
			'key' => 'field_college_phone',
			'label' => 'Phone Number(s)',
			'name' => 'college_phone',
			'type' => 'textarea',
			'instructions' => 'Enter contact phone numbers, one per line.',
		),
		array(
			'key' => 'field_college_email',
			'label' => 'Email Address',
			'name' => 'college_email',
			'type' => 'email',
		),
		array(
			'key' => 'field_college_website',
			'label' => 'Website URL',
			'name' => 'college_website',
			'type' => 'url',
		),
		array(
			'key' => 'field_college_academics_tab',
			'label' => 'Academics & Fees',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		),
		array(
			'key' => 'field_college_courses_offered_link',
			'label' => 'Courses Offered (Link)',
			'name' => 'college_courses_offered_link',
			'type' => 'relationship', // Link to 'course' CPT
			'post_type' => array(
				0 => 'course',
			),
			'taxonomy' => '',
			'filters' => array(
				0 => 'search',
			),
			'elements' => '',
			'min' => '',
			'max' => '',
			'return_format' => 'object', // Or 'id'
			'multiple' => 1, // Assuming this field in college CPT links to multiple courses
		),
		array(
			'key' => 'field_college_average_fees',
			'label' => 'Average Annual Fees',
			'name' => 'college_average_fees',
			'type' => 'text', // Or number
			'instructions' => 'e.g., INR 50,000 - 2,00,000 per year',
		),
		array(
			'key' => 'field_college_scholarships',
			'label' => 'Scholarship Details',
			'name' => 'college_scholarships',
			'type' => 'wysiwyg',
			'tabs' => 'all',
			'toolbar' => 'basic',
			'media_upload' => 0,
		),
		array(
			'key' => 'field_college_placements_tab',
			'label' => 'Placements',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		),
		array(
			'key' => 'field_college_placement_overview',
			'label' => 'Placement Overview',
			'name' => 'college_placement_overview',
			'type' => 'wysiwyg',
		),
		array(
			'key' => 'field_college_placement_stats',
			'label' => 'Placement Statistics',
			'name' => 'college_placement_stats',
			'type' => 'repeater', // ACF Pro field
			'instructions' => 'Add key placement statistics, e.g., Highest Package, Average Package, Top Recruiters.',
			'collapsed' => '',
			'min' => 0,
			'max' => 0,
			'layout' => 'table',
			'button_label' => 'Add Statistic',
			'sub_fields' => array(
				array(
					'key' => 'field_college_placement_stat_label',
					'label' => 'Statistic Label',
					'name' => 'label',
					'type' => 'text',
				),
				array(
					'key' => 'field_college_placement_stat_value',
					'label' => 'Value',
					'name' => 'value',
					'type' => 'text',
				),
			),
		),
		array(
			'key' => 'field_college_top_recruiters',
			'label' => 'Top Recruiters (comma separated)',
			'name' => 'college_top_recruiters',
			'type' => 'text',
		),
		array(
			'key' => 'field_college_media_tab',
			'label' => 'Media',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		),
		array(
			'key' => 'field_college_hero_banner',
			'label' => 'Hero Banner Image',
			'name' => 'college_hero_banner',
			'type' => 'image',
			'instructions' => 'Upload a large banner image for the college profile page.',
			'return_format' => 'array', // Or 'url' or 'id'
			'preview_size' => 'medium',
			'library' => 'all',
		),
		array(
			'key' => 'field_college_gallery_images',
			'label' => 'Image Gallery',
			'name' => 'college_gallery_images',
			'type' => 'gallery', // ACF Pro field
			'instructions' => 'Upload multiple images for the college gallery.',
			'return_format' => 'array',
			'preview_size' => 'thumbnail',
			'insert' => 'append',
			'library' => 'all',
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'college',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default', // Or 'seamless'
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => array(
		// Example: Hide default custom fields meta box if you manage everything via ACF
		// 0 => 'custom_fields',
	),
	'active' => true,
	'description' => 'Custom fields for College profiles.',
));

endif;
?>
