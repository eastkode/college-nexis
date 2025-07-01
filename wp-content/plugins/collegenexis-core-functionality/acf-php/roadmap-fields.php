<?php
/**
 * ACF Field Groups for Career Roadmap CPT
 */
if( function_exists('acf_add_local_field_group') ):

acf_add_local_field_group(array(
	'key' => 'group_roadmap_details',
	'title' => 'Career Roadmap Details',
	'fields' => array(
		array(
			'key' => 'field_roadmap_introduction',
			'label' => 'Introduction to the Career Path',
			'name' => 'roadmap_introduction',
			'type' => 'wysiwyg',
			'instructions' => 'Briefly describe this career path and its prospects.',
		),
		array(
			'key' => 'field_roadmap_steps_tab',
			'label' => 'Roadmap Steps',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		),
		array(
			'key' => 'field_roadmap_steps',
			'label' => 'Career Steps',
			'name' => 'roadmap_steps',
			'type' => 'repeater', // ACF Pro field
			'instructions' => 'Define the steps in this career roadmap. Each step can include courses, skills, and colleges.',
			'required' => 1,
			'collapsed' => 'field_roadmap_step_title',
			'min' => 1,
			'max' => 0,
			'layout' => 'block', // Or 'table' or 'row'
			'button_label' => 'Add Step',
			'sub_fields' => array(
				array(
					'key' => 'field_roadmap_step_title',
					'label' => 'Step Title',
					'name' => 'step_title',
					'type' => 'text',
					'instructions' => 'e.g., Foundation Studies, Specialization, Advanced Skills',
					'required' => 1,
				),
				array(
					'key' => 'field_roadmap_step_description',
					'label' => 'Step Description',
					'name' => 'step_description',
					'type' => 'wysiwyg',
					'tabs' => 'all',
					'toolbar' => 'basic',
					'media_upload' => 0,
				),
				array(
					'key' => 'field_roadmap_step_courses',
					'label' => 'Recommended Courses for this Step',
					'name' => 'step_courses',
					'type' => 'relationship',
					'post_type' => array(
						0 => 'course',
					),
					'taxonomy' => '',
					'filters' => array(
						0 => 'search',
						1 => 'taxonomy', // Filter by course_category
					),
					'elements' => array(
						0 => 'featured_image',
					),
					'return_format' => 'object',
					'multiple' => 1,
				),
				array(
					'key' => 'field_roadmap_step_colleges',
					'label' => 'Suggested Colleges for this Step',
					'name' => 'step_colleges',
					'type' => 'relationship',
					'post_type' => array(
						0 => 'college',
					),
					'taxonomy' => '',
					'filters' => array(
						0 => 'search',
						1 => 'taxonomy', // Filter by college_type
					),
					'elements' => array(
						0 => 'featured_image',
					),
					'return_format' => 'object',
					'multiple' => 1,
				),
				array(
					'key' => 'field_roadmap_step_skills',
					'label' => 'Skills to Acquire',
					'name' => 'step_skills',
					'type' => 'textarea',
					'instructions' => 'List key skills, one per line.',
				),
			),
		),
		array(
			'key' => 'field_roadmap_alternatives_tab',
			'label' => 'Related Info',
			'type' => 'tab',
			'placement' => 'top',
			'endpoint' => 0,
		),
		array(
			'key' => 'field_roadmap_alternative_paths',
			'label' => 'Alternative Career Paths',
			'name' => 'roadmap_alternative_paths',
			'type' => 'relationship',
			'post_type' => array(
				0 => 'roadmap', // Link to other roadmaps
			),
			'filters' => array(
				0 => 'search',
			),
			'return_format' => 'object',
			'multiple' => 1,
		),
		array(
			'key' => 'field_roadmap_related_courses',
			'label' => 'General Related Courses',
			'name' => 'roadmap_related_courses',
			'type' => 'relationship',
			'post_type' => array(
				0 => 'course',
			),
			'filters' => array(
				0 => 'search',
				1 => 'taxonomy',
			),
			'return_format' => 'object',
			'multiple' => 1,
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'post_type',
				'operator' => '==',
				'value' => 'roadmap',
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
	'description' => 'Custom fields for Career Roadmap profiles.',
));

endif;
?>
