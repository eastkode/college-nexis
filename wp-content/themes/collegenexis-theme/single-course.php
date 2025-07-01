<?php
/**
 * The template for displaying all single Course posts
 *
 * @package College_Nexis_Theme
 */

get_header();
?>

	<main id="primary" class="site-main">
		<div class="container">
			<?php
			while ( have_posts() ) :
				the_post();

				the_post();
				?>
				<article id="post-<?php the_ID(); ?>" <?php post_class('course-profile'); ?>>
					<header class="entry-header course-header">
						<?php
						$course_icon = get_field('course_icon');
						if ($course_icon && isset($course_icon['url'])): ?>
							<div class="course-icon">
								<img src="<?php echo esc_url($course_icon['url']); ?>" alt="<?php echo esc_attr($course_icon['alt'] ?: get_the_title() . ' Icon'); ?>">
							</div>
						<?php endif; ?>
						<?php the_title('<h1 class="entry-title course-name">', '</h1>'); ?>

						<?php if ($summary = get_field('course_summary_short')): ?>
							<p class="course-summary-tagline"><?php echo esc_html($summary); ?></p>
						<?php endif; ?>
					</header><!-- .entry-header -->

					<div class="entry-content course-details-content">

						<?php // Main Post Content (Detailed Description)
                        if (get_the_content()): ?>
                        <section id="course-detailed-description" class="course-section">
                            <h2><?php esc_html_e('About This Course', 'collegenexis-theme'); ?></h2>
                            <?php the_content(); ?>
                        </section>
                        <?php endif; ?>

						<section id="course-overview" class="course-section">
							<h2><?php esc_html_e('Course Overview', 'collegenexis-theme'); ?></h2>
							<ul class="overview-details">
								<?php if ($course_cat_terms = get_the_terms(get_the_ID(), 'course_category')): ?>
									<li><strong><?php esc_html_e('Category:', 'collegenexis-theme'); ?></strong> <?php echo esc_html($course_cat_terms[0]->name); ?></li>
								<?php endif; ?>
								<?php if ($duration = get_field('course_duration_details')): ?>
									<li><strong><?php esc_html_e('Duration:', 'collegenexis-theme'); ?></strong> <?php echo esc_html($duration); ?></li>
								<?php endif; ?>
							</ul>
						</section>

						<?php if ($eligibility = get_field('course_eligibility_criteria')): ?>
						<section id="course-eligibility" class="course-section">
							<h2><?php esc_html_e('Eligibility Criteria', 'collegenexis-theme'); ?></h2>
							<?php echo wp_kses_post($eligibility); ?>
						</section>
						<?php endif; ?>

						<?php if ($general_fees = get_field('course_general_fee_details')): ?>
						<section id="course-general-fees" class="course-section">
							<h2><?php esc_html_e('General Fee Information', 'collegenexis-theme'); ?></h2>
							<?php echo wp_kses_post($general_fees); ?>
						</section>
						<?php endif; ?>

						<section id="course-career-scope" class="course-section">
							<h2><?php esc_html_e('Career Scope & Prospects', 'collegenexis-theme'); ?></h2>
							<?php if ($career_scope_desc = get_field('course_career_scope_description')): ?>
								<?php echo wp_kses_post($career_scope_desc); ?>
							<?php endif; ?>
							<?php if ($avg_salary = get_field('course_average_salary_general')): ?>
								<p><strong><?php esc_html_e('Average Starting Salary (Estimate):', 'collegenexis-theme'); ?></strong> <?php echo esc_html($avg_salary); ?></p>
							<?php endif; ?>
							<?php if ($future_studies = get_field('course_future_studies_options')): ?>
								<h3><?php esc_html_e('Future Studies Options:', 'collegenexis-theme'); ?></h3>
								<?php echo wp_kses_post($future_studies); ?>
							<?php endif; ?>
						</section>

						<?php if ($entrance_summary = get_field('course_entrance_exams_summary')): ?>
						<section id="course-entrance-exams" class="course-section">
							<h2><?php esc_html_e('Entrance Exams & Admission', 'collegenexis-theme'); ?></h2>
							<?php echo wp_kses_post($entrance_summary); ?>
						</section>
						<?php endif; ?>

						<?php
						$colleges_offering = get_field('course_colleges_offering_this');
						if ($colleges_offering): ?>
						<section id="course-colleges-offering" class="course-section">
							<h2><?php esc_html_e('Colleges Offering This Course (Examples)', 'collegenexis-theme'); ?></h2>
							<ul class="colleges-list">
								<?php foreach ($colleges_offering as $college_post): ?>
									<li>
										<a href="<?php echo esc_url(get_permalink($college_post->ID)); ?>">
											<?php echo esc_html(get_the_title($college_post->ID)); ?>
										</a>
										<?php
										$college_city = get_field('college_city', $college_post->ID);
										if ($college_city) {
											echo ' <span class="college-location">(' . esc_html($college_city) . ')</span>';
										}
										?>
									</li>
								<?php endforeach; ?>
							</ul>
							<p><small><?php esc_html_e('Note: For specific fee structures at each college, please refer to the individual college pages.', 'collegenexis-theme'); ?></small></p>
						</section>
						<?php endif; ?>

					</div><!-- .entry-content -->

					<footer class="entry-footer">
						<?php edit_post_link(esc_html__('Edit This Course', 'collegenexis-theme'), '<span class="edit-link">', '</span>'); ?>
					</footer><!-- .entry-footer -->
				</article><!-- #post-<?php the_ID(); ?> -->
				<?php

				// If comments are open or we have at least one comment, load up the comment template.
				if ( comments_open() || get_comments_number() ) :
					comments_template();
				endif;

				the_post_navigation(
					array(
						'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous Course:', 'collegenexis-theme' ) . '</span> <span class="nav-title">%title</span>',
						'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next Course:', 'collegenexis-theme' ) . '</span> <span class="nav-title">%title</span>',
					)
				);

			endwhile; // End of the loop.
			?>
		</div><!-- .container -->
	</main><!-- #main -->

<?php
get_footer();
