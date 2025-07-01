<?php
/**
 * The template for displaying all single Roadmap posts
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
				<article id="post-<?php the_ID(); ?>" <?php post_class('roadmap-profile'); ?>>
					<header class="entry-header roadmap-header">
						<?php the_title('<h1 class="entry-title roadmap-name">', '</h1>'); ?>
						<?php if ($introduction = get_field('roadmap_introduction')): ?>
							<div class="roadmap-introduction lead">
								<?php echo wp_kses_post($introduction); ?>
							</div>
						<?php endif; ?>
					</header><!-- .entry-header -->

					<div class="entry-content roadmap-details-content">
						<?php if (have_rows('roadmap_steps')): ?>
							<section id="roadmap-steps" class="roadmap-section">
								<h2><?php esc_html_e('Career Steps', 'collegenexis-theme'); ?></h2>
								<div class="steps-accordion">
									<?php $step_count = 1; ?>
									<?php while(have_rows('roadmap_steps')): the_row(); ?>
										<div class="step-item">
											<h3 class="step-title">
												<button aria-expanded="false" aria-controls="step-content-<?php echo $step_count; ?>">
													<span class="step-number"><?php esc_html_e('Step', 'collegenexis-theme'); ?> <?php echo $step_count; ?>:</span> <?php echo esc_html(get_sub_field('step_title')); ?>
													<span class="icon" aria-hidden="true"></span>
												</button>
											</h3>
											<div id="step-content-<?php echo $step_count; ?>" class="step-content" hidden>
												<?php if ($step_description = get_sub_field('step_description')): ?>
													<div class="step-description-content">
														<?php echo wp_kses_post($step_description); ?>
													</div>
												<?php endif; ?>

												<?php if ($step_courses = get_sub_field('step_courses')): ?>
													<h4><?php esc_html_e('Recommended Courses:', 'collegenexis-theme'); ?></h4>
													<ul>
														<?php foreach($step_courses as $course_post): ?>
															<li><a href="<?php echo esc_url(get_permalink($course_post->ID)); ?>"><?php echo esc_html(get_the_title($course_post->ID)); ?></a></li>
														<?php endforeach; ?>
													</ul>
												<?php endif; ?>

												<?php if ($step_colleges = get_sub_field('step_colleges')): ?>
													<h4><?php esc_html_e('Suggested Colleges:', 'collegenexis-theme'); ?></h4>
													<ul>
														<?php foreach($step_colleges as $college_post): ?>
															<li><a href="<?php echo esc_url(get_permalink($college_post->ID)); ?>"><?php echo esc_html(get_the_title($college_post->ID)); ?></a></li>
														<?php endforeach; ?>
													</ul>
												<?php endif; ?>

												<?php if ($step_skills = get_sub_field('step_skills')): ?>
													<h4><?php esc_html_e('Skills to Acquire:', 'collegenexis-theme'); ?></h4>
													<p><?php echo nl2br(esc_html($step_skills)); ?></p>
												<?php endif; ?>
											</div>
										</div>
										<?php $step_count++; ?>
									<?php endwhile; ?>
								</div>
							</section>
						<?php endif; ?>

						<?php
						$alt_paths = get_field('roadmap_alternative_paths');
						$related_courses_general = get_field('roadmap_related_courses');
						if ($alt_paths || $related_courses_general):
						?>
						<section id="roadmap-related-info" class="roadmap-section">
							<h2><?php esc_html_e('Related Information', 'collegenexis-theme'); ?></h2>
							<?php if ($alt_paths): ?>
								<h3><?php esc_html_e('Alternative Career Paths:', 'collegenexis-theme'); ?></h3>
								<ul>
									<?php foreach($alt_paths as $path_post): ?>
										<li><a href="<?php echo esc_url(get_permalink($path_post->ID)); ?>"><?php echo esc_html(get_the_title($path_post->ID)); ?></a></li>
									<?php endforeach; ?>
								</ul>
							<?php endif; ?>
							<?php if ($related_courses_general): ?>
								<h3><?php esc_html_e('General Related Courses:', 'collegenexis-theme'); ?></h3>
								<ul>
									<?php foreach($related_courses_general as $course_post): ?>
										<li><a href="<?php echo esc_url(get_permalink($course_post->ID)); ?>"><?php echo esc_html(get_the_title($course_post->ID)); ?></a></li>
									<?php endforeach; ?>
								</ul>
							<?php endif; ?>
						</section>
						<?php endif; ?>

                        <?php the_content(); // For any additional content added in main editor ?>

					</div><!-- .entry-content -->

					<footer class="entry-footer">
						<?php edit_post_link(esc_html__('Edit This Roadmap', 'collegenexis-theme'), '<span class="edit-link">', '</span>'); ?>
					</footer><!-- .entry-footer -->
				</article><!-- #post-<?php the_ID(); ?> -->
				<?php

				// If comments are open or we have at least one comment, load up the comment template.
				if ( comments_open() || get_comments_number() ) :
					comments_template();
				endif;

				the_post_navigation(
					array(
						'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous Roadmap:', 'collegenexis-theme' ) . '</span> <span class="nav-title">%title</span>',
						'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next Roadmap:', 'collegenexis-theme' ) . '</span> <span class="nav-title">%title</span>',
					)
				);

			endwhile; // End of the loop.
			?>
		</div><!-- .container -->
	</main><!-- #main -->

<?php
get_footer();
