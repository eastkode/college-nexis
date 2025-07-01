<?php
/**
 * ACF Field Groups for Exam Update CPT
 */
if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array(
	'key' => 'group_exam_update_details',
	'title' => 'Exam Update Details',
	'fields' => array(
		array(
			'key' => 'field_exam_update_type',
			'label' => 'Update Type',
			'name' => 'exam_update_type',
			'type' => 'select',
			'choices' => array(
				'announcement' => 'Announcement',
				'application_start' => 'Application Start',
				'application_end' => 'Application Deadline',
				'exam_date' => 'Exam Date',
				'result_declared' => 'Result Declared',
				'admit_card' => 'Admit Card Release',
				'other' => 'Other',
			),
			'default_value' => 'announcement',
			'allow_null' => 0,
			'multiple' => 0,
			'ui' => 1, // Use enhanced UI
			'ajax' => 0,
			'return_format' => 'value',
			'placeholder' => '',
		),
		array(
			'key' => 'field_exam_update_date',
			'label' => 'Key Date',
			'name' => 'exam_update_date',
			'type' => 'date_picker',
			'instructions' => 'The primary date for this update (e.g., exam date, application deadline).',
			'display_format' => 'F j, Y', // d/m/Y
			'return_format' => 'Ymd', // YYYYMMDD
			'first_day' => 1, // Monday
		),
		array(
			'key' => 'field_exam_update_related_course',
			'label' => 'Related Course(s)',
			'name' => 'exam_update_related_course',
			'type' => 'relationship',
			'post_type' => array(
				0 => 'course',
			),
			'taxonomy' => '',
			'filters' => array(
				0 => 'search',
				1 => 'taxonomy', // Filter by course_category
			),
			'elements' => '',
			'min' => '',
			'max' => '',
			'return_format' => 'object',
			'instructions' => 'If this exam is specific to certain courses.',
		),
		array(
			'key' => 'field_exam_update_official_link',
			'label' => 'Official Notification Link',
			'name' => 'exam_update_official_link',
			'type' => 'url',
			'instructions' => 'Link to the official website or notification PDF.',
		),
		array(
			'key' => 'field_exam_update_summary',
			'label' => 'Brief Summary / Details',
			'name' => 'exam_update_summary',
			'type' => 'wysiwyg',
			'instructions' => 'Provide a short summary or key details about this update. The main content can be in the post editor.',
			'tabs' => 'all',
			'toolbar' => 'basic',
			'media_upload' => 0,
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'exam_update',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => array(
        // Example: if you don't need the main editor for exam updates because summary is enough
		// 0 => 'the_content',
    ),
	'active' => true,
	'description' => 'Custom fields for Exam Update entries.',
));

endif;
?>
