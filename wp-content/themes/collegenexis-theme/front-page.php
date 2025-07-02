<?php
/**
 * The template for displaying the static front page.
 *
 * @package College_Nexis_Theme
 */

get_header();
?>

	<main id="primary" class="site-main">

		<?php
		// Display content of the page set as Front Page in Settings > Reading
		// This allows admins to add content above/below dynamic sections via the page editor.
		while ( have_posts() ) :
			the_post();
			if (get_the_content()) { // Only display if there's content in the page editor
				?>
				<article id="post-<?php the_ID(); ?>" <?php post_class('front-page-content'); ?>>
					<div class="container">
						<div class="entry-content">
							<?php the_content(); ?>
						</div><!-- .entry-content -->
					</div><!-- .container -->
				</article><!-- #post-<?php the_ID(); ?> -->
				<?php
			}
		endwhile; // End of the loop.
		?>

		<!-- Hero Section -->
		<section id="hero-section" class="front-page-section hero-section">
			<div class="container">
				<div class="hero-content-wrapper">
					<div class="hero-image-or-illustration">
						<!-- Placeholder for image/illustration - can be managed via Customizer or a dedicated options page -->
						<img src="<?php echo get_template_directory_uri() . '/assets/images/hero-placeholder.png'; // Example placeholder ?>" alt="College Nexis Hero Image">
					</div>
					<div class="hero-text-and-search">
						<h1 class="hero-tagline"><?php echo esc_html_e( 'Your Smart Companion to Discover, Plan, and Build Your Career.', 'collegenexis-theme' ); ?></h1>
						<p class="hero-subtagline"><?php echo esc_html_e( 'Find the right college, the right course, stress-free.', 'collegenexis-theme' ); ?></p>
						<div class="hero-search-form">
							<?php get_search_form(); ?>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Featured Colleges Section -->
		<section id="featured-colleges-section" class="front-page-section featured-colleges">
			<div class="container">
				<h2 class="section-title"><?php esc_html_e('Featured Colleges', 'collegenexis-theme'); ?></h2>
				<?php
				$featured_colleges_args = array(
					'post_type' => 'college',
					'posts_per_page' => 4, // Adjust number as needed
					'meta_query' => array(
						array(
							'key' => 'college_is_featured',
							'value' => '1',
							'compare' => '=',
						),
					),
					'no_found_rows' => true, // Optimization
				);
				$featured_colleges_query = new WP_Query($featured_colleges_args);

				if ($featured_colleges_query->have_posts()) :
				?>
					<div class="college-listings-grid featured-colleges-grid">
						<?php
						while ($featured_colleges_query->have_posts()) : $featured_colleges_query->the_post();
							// Using the same card structure as archive-college.php for consistency
							// You might want to create a dedicated template part: get_template_part('template-parts/content', 'college-card');
							?>
							<article id="post-<?php the_ID(); ?>" <?php post_class('college-card'); ?>>
								<div class="college-card-inner">
									<?php
									$logo_image = get_field('college_logo_image');
									if ($logo_image && isset($logo_image['sizes']['medium'])) : ?>
										<div class="college-card-logo">
											<a href="<?php the_permalink(); ?>">
												<img src="<?php echo esc_url($logo_image['sizes']['medium']); ?>" alt="<?php echo esc_attr($logo_image['alt'] ?: get_the_title() . ' Logo'); ?>">
											</a>
										</div>
									<?php elseif (has_post_thumbnail()) : ?>
										<div class="college-card-logo">
											<a href="<?php the_permalink(); ?>">
												<?php the_post_thumbnail('medium'); ?>
											</a>
										</div>
									<?php endif; ?>
									<div class="college-card-content">
										<?php the_title(sprintf('<h3 class="entry-title college-card-title"><a href="%s" rel="bookmark">', esc_url(get_permalink())), '</a></h3>'); ?>
										<?php
										$city = get_field('college_city');
										$state = get_field('college_state');
										if ($city || $state) : ?>
											<p class="college-card-location">
												<?php if ($city) echo esc_html($city); ?><?php if ($city && $state) echo ', '; ?><?php if ($state) echo esc_html($state); ?>
											</p>
										<?php endif; ?>
										<a href="<?php the_permalink(); ?>" class="button college-card-button"><?php esc_html_e('View Details', 'collegenexis-theme'); ?></a>
									</div>
								</div>
							</article>
						<?php endwhile; ?>
					</div>
				<?php
				wp_reset_postdata(); // Important after custom WP_Query
				else :
					echo '<p>' . esc_html__('No featured colleges available at the moment.', 'collegenexis-theme') . '</p>';
				endif;
				?>
			</div>
		</section>

		<!-- Browse by Course Category Section -->
		<section id="course-categories-section" class="front-page-section course-categories">
			<div class="container">
				<h2 class="section-title"><?php esc_html_e('Browse by Course Category', 'collegenexis-theme'); ?></h2>
				<?php
				$course_categories = get_terms(array(
					'taxonomy' => 'course_category',
					'hide_empty' => true, // Set to false if you want to show empty categories
					'orderby' => 'name',
					'order' => 'ASC',
				));
				if (!empty($course_categories) && !is_wp_error($course_categories)) :
				?>
					<ul class="course-category-list">
						<?php foreach ($course_categories as $category) : ?>
							<li class="course-category-item">
								<a href="<?php echo esc_url(get_term_link($category)); ?>">
									<?php // You could add an ACF image field to the taxonomy for icons here ?>
									<span class="category-name"><?php echo esc_html($category->name); ?></span>
									<span class="category-count">(<?php echo esc_html($category->count); ?> <?php esc_html_e('Courses', 'collegenexis-theme'); ?>)</span>
								</a>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php else : ?>
					<p><?php esc_html_e('No course categories found.', 'collegenexis-theme'); ?></p>
				<?php endif; ?>
			</div>
		</section>

		<!-- Latest Blog Posts Section -->
		<section id="latest-blog-posts-section" class="front-page-section latest-posts">
			<div class="container">
				<h2 class="section-title"><?php esc_html_e('From Our Blog', 'collegenexis-theme'); ?></h2>
				<?php
				$latest_posts_args = array(
					'post_type' => 'post',
					'posts_per_page' => 3, // Adjust number as needed
					'ignore_sticky_posts' => 1,
					'no_found_rows' => true,
				);
				$latest_posts_query = new WP_Query($latest_posts_args);
				if ($latest_posts_query->have_posts()) :
				?>
					<div class="post-listings-grid latest-blog-grid">
						<?php
						while ($latest_posts_query->have_posts()) : $latest_posts_query->the_post();
							// Using a simplified card for blog posts
						?>
							<article id="post-<?php the_ID(); ?>" <?php post_class('post-card'); ?>>
								<div class="post-card-inner">
									<?php if (has_post_thumbnail()) : ?>
										<div class="post-card-thumbnail">
											<a href="<?php the_permalink(); ?>">
												<?php the_post_thumbnail('medium_large'); // Or another appropriate size ?>
											</a>
										</div>
									<?php endif; ?>
									<div class="post-card-content">
										<?php the_title(sprintf('<h3 class="entry-title post-card-title"><a href="%s" rel="bookmark">', esc_url(get_permalink())), '</a></h3>'); ?>
										<div class="post-card-excerpt">
											<?php the_excerpt(); ?>
										</div>
										<a href="<?php the_permalink(); ?>" class="button post-card-button"><?php esc_html_e('Read More', 'collegenexis-theme'); ?></a>
									</div>
								</div>
							</article>
						<?php endwhile; ?>
					</div>
				<?php
				wp_reset_postdata();
				else :
					echo '<p>' . esc_html__('No blog posts available yet.', 'collegenexis-theme') . '</p>';
				endif;
				?>
			</div>
		</section>

		<!-- Latest Exam Updates Section -->
		<section id="latest-exam-updates-section" class="front-page-section latest-exam-updates">
			<div class="container">
				<h2 class="section-title"><?php esc_html_e('Latest Exam Updates', 'collegenexis-theme'); ?></h2>
				<?php
				$latest_exams_args = array(
					'post_type' => 'exam_update',
					'posts_per_page' => 5, // Adjust number as needed
					'orderby' => 'date', // Or 'meta_value_num' if sorting by 'exam_update_date'
					// 'meta_key' => 'exam_update_date', // if sorting by this ACF field
					'order' => 'DESC',
					'no_found_rows' => true,
				);
				$latest_exams_query = new WP_Query($latest_exams_args);
				if ($latest_exams_query->have_posts()) :
				?>
					<ul class="exam-update-list">
						<?php
						while ($latest_exams_query->have_posts()) : $latest_exams_query->the_post();
						?>
							<li class="exam-update-list-item">
								<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
								<?php
								$key_date = get_field('exam_update_date');
								if ($key_date): ?>
									<span class="exam-date-meta"> - <?php echo esc_html(date_i18n(get_option('date_format'), strtotime($key_date))); ?></span>
								<?php endif; ?>
							</li>
						<?php endwhile; ?>
					</ul>
				<?php
				wp_reset_postdata();
				else :
					echo '<p>' . esc_html__('No exam updates posted recently.', 'collegenexis-theme') . '</p>';
				endif;
				?>
			</div>
		</section>

	</main><!-- #main -->

<?php
get_footer();
?>
