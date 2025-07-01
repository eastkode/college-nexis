<?php
/**
 * ACF Field Groups for Course CPT
 */
if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array(
	'key' => 'group_course_details',
	'title' => 'Course Details',
	'fields' => array(
		array(
			'key' => 'field_course_description_tab',
			'label' => 'Overview',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		),
		array(
			'key' => 'field_course_summary',
			'label' => 'Brief Summary',
			'name' => 'course_summary',
			'type' => 'textarea',
			'instructions' => 'A short summary of the course (1-2 sentences). Used in listings.',
			'maxlength' => 300,
		),
		array(
			'key' => 'field_course_duration',
			'label' => 'Course Duration',
			'name' => 'course_duration',
			'type' => 'text',
			'instructions' => 'e.g., 3 Years, 4 Semesters',
		),
		array(
			'key' => 'field_course_eligibility',
			'label' => 'Eligibility Criteria',
			'name' => 'course_eligibility',
			'type' => 'wysiwyg',
			'tabs' => 'all',
			'toolbar' => 'basic',
			'media_upload' => 0,
		),
		array(
			'key' => 'field_course_scope_tab',
			'label' => 'Career & Scope',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		),
		array(
			'key' => 'field_course_career_scope',
			'label' => 'Career Scope',
			'name' => 'course_career_scope',
			'type' => 'wysiwyg',
			'instructions' => 'Describe the career opportunities after completing this course.',
		),
		array(
			'key' => 'field_course_future_opportunities',
			'label' => 'Future Opportunities',
			'name' => 'course_future_opportunities',
			'type' => 'wysiwyg',
			'instructions' => 'Higher studies options or advanced roles.',
		),
		array(
			'key' => 'field_course_avg_salary',
			'label' => 'Average Starting Salary (Approx)',
			'name' => 'course_avg_salary',
			'type' => 'text',
			'instructions' => 'e.g., INR 3-5 LPA',
		),
		array(
			'key' => 'field_course_colleges_tab',
			'label' => 'Colleges & Fees',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		),
		array(
			'key' => 'field_course_colleges_offering',
			'label' => 'Colleges Offering This Course',
			'name' => 'course_colleges_offering',
			'type' => 'relationship',
			'post_type' => array(
				0 => 'college',
			),
			'taxonomy' => '',
			'filters' => array(
				0 => 'search',
				1 => 'taxonomy', // Allow filtering by college_type if needed
			),
			'elements' => array(
				0 => 'featured_image',
			),
			'min' => '',
			'max' => '',
			'return_format' => 'object', // Or 'id'
			'instructions' => 'Select colleges that offer this course.',
		),
		array(
			'key' => 'field_course_average_fees',
			'label' => 'Average Course Fees',
			'name' => 'course_average_fees',
			'type' => 'text',
			'instructions' => 'e.g., INR 1,00,000 to 5,00,000 total',
		),
		array(
			'key' => 'field_course_exams_tab',
			'label' => 'Entrance Exams',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		),
		array(
			'key' => 'field_course_entrance_exams_info',
			'label' => 'Entrance Exams Information',
			'name' => 'course_entrance_exams_info',
			'type' => 'wysiwyg',
			'instructions' => 'List common entrance exams for this course, their patterns, etc. You can also link to Exam Update posts.',
		),
		// Potentially a relationship field to 'exam_update' CPT if you want direct linking
		// array(
		// 	'key' => 'field_course_related_exams',
		// 	'label' => 'Related Entrance Exams',
		// 	'name' => 'course_related_exams',
		// 	'type' => 'relationship',
		// 	'post_type' => array(
		// 		0 => 'exam_update',
		// 	),
		// 	'return_format' => 'object',
		// ),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'course',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => array(),
	'active' => true,
	'description' => 'Custom fields for Course profiles.',
));

endif;
?>
