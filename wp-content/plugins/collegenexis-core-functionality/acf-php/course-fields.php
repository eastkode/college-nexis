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
			'key' => 'field_course_basic_details_tab',
			'label' => 'Basic Details',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		),
		array(
			'key' => 'field_course_category_taxonomy',
			'label' => 'Course Category',
			'name' => 'course_category_taxonomy',
			'type' => 'taxonomy',
			'taxonomy' => 'course_category',
			'field_type' => 'select', // or 'checkbox' for multiple
			'allow_null' => 0,
			'add_term' => 1,
			'save_terms' => 1,
			'load_terms' => 1,
			'return_format' => 'id',
			'multiple' => 0,
			'instructions' => 'Select the primary category for this course.',
		),
		array(
			'key' => 'field_course_icon',
			'label' => 'Course Icon',
			'name' => 'course_icon',
			'type' => 'image',
			'instructions' => 'Upload an icon for this course (e.g., for display on homepage or listings).',
			'return_format' => 'array', // or 'id' or 'url'
			'preview_size' => 'thumbnail',
			'library' => 'all',
		),
		array(
			'key' => 'field_course_summary_short',
			'label' => 'Short Summary / Tagline',
			'name' => 'course_summary_short',
			'type' => 'textarea',
			'instructions' => 'A brief tagline or summary for the course (1-2 sentences). Useful for listings and meta descriptions.',
			'rows' => 3,
			'maxlength' => 300,
		),
		array(
			'key' => 'field_course_academic_info_tab',
			'label' => 'Academic Information',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		),
		array(
			'key' => 'field_course_duration_details',
			'label' => 'Course Duration',
			'name' => 'course_duration_details',
			'type' => 'text',
			'instructions' => 'e.g., 3 Years, 6 Semesters; Full-time; Part-time',
		),
		array(
			'key' => 'field_course_eligibility_criteria',
			'label' => 'Eligibility Criteria',
			'name' => 'course_eligibility_criteria',
			'type' => 'wysiwyg',
			'instructions' => 'Detail the eligibility requirements for enrolling in this course.',
			'tabs' => 'all',
			'toolbar' => 'full', // 'basic' or 'full'
			'media_upload' => 0, // Disable media upload in this WYSIWYG
		),
		array(
			'key' => 'field_course_general_fee_details',
			'label' => 'General Fee Information',
			'name' => 'course_general_fee_details',
			'type' => 'wysiwyg', // Using WYSIWYG to allow for more flexible formatting of fee ranges, types, etc.
			'instructions' => 'Provide a general overview of the fee structure for this course (e.g., "Typically ranges from ₹X to ₹Y depending on the college"). Specific fees per college are listed on the College profile.',
			'tabs' => 'all',
			'toolbar' => 'basic',
			'media_upload' => 0,
		),
		array(
			'key' => 'field_course_career_prospects_tab',
			'label' => 'Career Prospects & Scope',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		),
		array(
			'key' => 'field_course_career_scope_description',
			'label' => 'Career Scope & Opportunities',
			'name' => 'course_career_scope_description',
			'type' => 'wysiwyg',
			'instructions' => 'Describe the typical career paths, job roles, and industries available after completing this course.',
			'tabs' => 'all',
			'toolbar' => 'full',
			'media_upload' => 0,
		),
		array(
			'key' => 'field_course_average_salary_general',
			'label' => 'Average Starting Salary (General Estimate)',
			'name' => 'course_average_salary_general',
			'type' => 'text',
			'instructions' => 'Provide a general estimated average starting salary for graduates of this course (e.g., INR 3-6 LPA).',
		),
		array(
			'key' => 'field_course_future_studies_options',
			'label' => 'Future Studies Options',
			'name' => 'course_future_studies_options',
			'type' => 'wysiwyg',
			'instructions' => 'Detail further educational opportunities or specializations available after this course (e.g., Master\'s degrees, PhD, certifications).',
			'tabs' => 'all',
			'toolbar' => 'basic',
			'media_upload' => 0,
		),
		array(
			'key' => 'field_course_entrance_info_tab',
			'label' => 'Entrance & Admission',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		),
		array(
			'key' => 'field_course_entrance_exams_summary',
			'label' => 'Entrance Exams Summary',
			'name' => 'course_entrance_exams_summary',
			'type' => 'wysiwyg',
			'instructions' => 'List common entrance exams for admission to this course, general pattern, and links to relevant Exam Update posts if applicable.',
			'tabs' => 'all',
			'toolbar' => 'full',
			'media_upload' => 0,
		),
		array(
			'key' => 'field_course_colleges_offering_this',
			'label' => 'Colleges Known to Offer This Course',
			'name' => 'course_colleges_offering_this',
			'type' => 'relationship',
			'instructions' => 'This is an informational field. The primary management of which college offers which course (and specific fees) is done on the College profile page.',
			'post_type' => array(
				0 => 'college',
			),
			'taxonomy' => '',
			'filters' => array(
				0 => 'search',
				1 => 'taxonomy',
			),
			'elements' => array(
				0 => 'featured_image',
			),
			'min' => '',
			'max' => '',
			'return_format' => 'object',
		),
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
	'position' => 'acf_after_title', // Consistent with College CPT
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => array(
		1 => 'excerpt',
		2 => 'discussion',
		3 => 'comments',
		// Keep 'the_content' (main editor) for detailed course description
	),
	'active' => true,
	'description' => 'Comprehensive custom fields for Course profiles.',
));

endif;
?>
