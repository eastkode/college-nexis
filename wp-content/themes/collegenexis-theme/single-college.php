<?php
/**
 * The template for displaying all single College posts
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
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
				<article id="post-<?php the_ID(); ?>" <?php post_class('college-profile'); ?>>
					<header class="entry-header college-header">
						<?php
						// Display Hero Image if available
						$hero_image = get_field('college_hero_image');
						if ($hero_image && isset($hero_image['url'])) :
							?>
							<div class="college-hero-banner" style="background-image: url('<?php echo esc_url($hero_image['url']); ?>');">
								<?php /* You can add overlay content here if needed */ ?>
							</div>
						<?php endif; ?>

						<div class="college-title-logo-wrapper">
                            <?php
                            // College Logo
                            $logo_image = get_field('college_logo_image');
                            if ($logo_image && isset($logo_image['url'])) :
                                ?>
                                <div class="college-logo">
                                    <img src="<?php echo esc_url($logo_image['url']); ?>" alt="<?php echo esc_attr($logo_image['alt'] ?: get_the_title() . ' Logo'); ?>">
                                </div>
                            <?php elseif (has_post_thumbnail()) : ?>
                                <div class="college-logo">
                                    <?php the_post_thumbnail('medium'); ?>
                                </div>
                            <?php endif; ?>
						    <?php the_title('<h1 class="entry-title college-name">', '</h1>'); ?>
                        </div>
                        <?php
                        $city = get_field('college_city');
                        $state = get_field('college_state');
                        if ($city || $state) : ?>
                            <p class="college-location-summary">
                                <?php if ($city) echo esc_html($city); ?>
                                <?php if ($city && $state) echo ', '; ?>
                                <?php if ($state) echo esc_html($state); ?>
                            </p>
                        <?php endif; ?>
					</header><!-- .entry-header -->

					<div class="entry-content college-details-content">

                        <?php // Main Post Content (Description)
                        if (get_the_content()): ?>
                        <section id="college-description" class="college-section">
                            <h2><?php esc_html_e('About the College', 'collegenexis-theme'); ?></h2>
                            <?php the_content(); ?>
                        </section>
                        <?php endif; ?>

						<section id="college-overview" class="college-section">
							<h2><?php esc_html_e('Overview', 'collegenexis-theme'); ?></h2>
							<ul class="overview-details">
								<?php if ($college_type_terms = get_the_terms(get_the_ID(), 'college_type')): ?>
									<li><strong><?php esc_html_e('Category:', 'collegenexis-theme'); ?></strong> <?php echo esc_html($college_type_terms[0]->name); ?></li>
								<?php endif; ?>
								<?php if ($est_year = get_field('college_establishment_year')): ?>
									<li><strong><?php esc_html_e('Established:', 'collegenexis-theme'); ?></strong> <?php echo esc_html($est_year); ?></li>
								<?php endif; ?>
								<?php if ($approved_by = get_field('college_approved_by')): ?>
									<li><strong><?php esc_html_e('Approved By:', 'collegenexis-theme'); ?></strong> <?php echo nl2br(esc_html($approved_by)); ?></li>
								<?php endif; ?>
								<?php if ($affiliated_to = get_field('college_affiliated_university')): ?>
									<li><strong><?php esc_html_e('Affiliated To:', 'collegenexis-theme'); ?></strong> <?php echo nl2br(esc_html($affiliated_to)); ?></li>
								<?php endif; ?>
							</ul>
						</section>

						<section id="college-address-contact" class="college-section">
							<h2><?php esc_html_e('Address & Contact', 'collegenexis-theme'); ?></h2>
							<?php if ($address = get_field('college_address_street')): ?>
								<p><strong><?php esc_html_e('Address:', 'collegenexis-theme'); ?></strong><br><?php echo nl2br(esc_html($address)); ?>, <?php echo esc_html(get_field('college_city')); ?>, <?php echo esc_html(get_field('college_state')); ?> - <?php echo esc_html(get_field('college_pin_code')); ?></p>
							<?php endif; ?>
							<?php if ($phone = get_field('college_phone_number')): ?>
								<p><strong><?php esc_html_e('Phone:', 'collegenexis-theme'); ?></strong> <?php echo esc_html($phone); ?></p>
							<?php endif; ?>
							<?php if ($email = get_field('college_email')): ?>
								<p><strong><?php esc_html_e('Email:', 'collegenexis-theme'); ?></strong> <a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a></p>
							<?php endif; ?>
							<?php if ($website = get_field('college_website')): ?>
								<p><strong><?php esc_html_e('Website:', 'collegenexis-theme'); ?></strong> <a href="<?php echo esc_url($website); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html($website); ?></a></p>
							<?php endif; ?>
							<?php if ($map = get_field('college_google_map')): // ACF Pro field ?>
								<div class="acf-map">
									<div class="marker" data-lat="<?php echo esc_attr($map['lat']); ?>" data-lng="<?php echo esc_attr($map['lng']); ?>"></div>
								</div>
                                <p><small><?php esc_html_e('(Map functionality requires ACF Pro and Google Maps API setup)', 'collegenexis-theme'); ?></small></p>
							<?php endif; ?>
						</section>

						<?php if (have_rows('college_courses_fees_structure')): ?>
						<section id="college-courses-fees" class="college-section">
							<h2><?php esc_html_e('Courses & Fee Structure', 'collegenexis-theme'); ?></h2>
							<div class="courses-fees-table">
								<table>
									<thead>
										<tr>
											<th><?php esc_html_e('Course Name / Degree', 'collegenexis-theme'); ?></th>
											<th><?php esc_html_e('Fee Details', 'collegenexis-theme'); ?></th>
											<th><?php esc_html_e('Duration', 'collegenexis-theme'); ?></th>
											<th><?php esc_html_e('Eligibility (Brief)', 'collegenexis-theme'); ?></th>
										</tr>
									</thead>
									<tbody>
									<?php while(have_rows('college_courses_fees_structure')): the_row(); ?>
										<tr>
											<td><?php echo esc_html(get_sub_field('course_name')); ?></td>
											<td><?php echo esc_html(get_sub_field('fee_details')); ?></td>
											<td><?php echo esc_html(get_sub_field('duration')); ?></td>
											<td><?php echo esc_html(get_sub_field('eligibility_summary')); ?></td>
										</tr>
									<?php endwhile; ?>
									</tbody>
								</table>
							</div>
						</section>
						<?php endif; ?>

						<?php if (have_rows('college_rankings')): ?>
						<section id="college-rankings" class="college-section">
							<h2><?php esc_html_e('Rankings', 'collegenexis-theme'); ?></h2>
							<ul>
							<?php while(have_rows('college_rankings')): the_row(); ?>
								<li>
									<strong><?php echo esc_html(get_sub_field('rank_provider')); ?> (<?php echo esc_html(get_sub_field('rank_year')); ?>):</strong>
									<?php echo esc_html(get_sub_field('rank_value')); ?>
									<?php if ($stream = get_sub_field('rank_stream')): ?>
										<em>for <?php echo esc_html($stream); ?></em>
									<?php endif; ?>
								</li>
							<?php endwhile; ?>
							</ul>
						</section>
						<?php endif; ?>

						<?php if (get_field('college_placement_overview') || have_rows('college_placement_stats_repeater') || get_field('college_top_recruiters') ): ?>
						<section id="college-placements" class="college-section">
							<h2><?php esc_html_e('Placements', 'collegenexis-theme'); ?></h2>
							<?php if ($placement_overview = get_field('college_placement_overview')): ?>
								<div class="placement-overview"><?php echo wp_kses_post($placement_overview); ?></div>
							<?php endif; ?>
							<?php if (have_rows('college_placement_stats_repeater')): ?>
								<h3><?php esc_html_e('Key Placement Statistics:', 'collegenexis-theme'); ?></h3>
								<ul>
								<?php while(have_rows('college_placement_stats_repeater')): the_row(); ?>
									<li><strong><?php echo esc_html(get_sub_field('stat_label')); ?>:</strong> <?php echo esc_html(get_sub_field('stat_value')); ?></li>
								<?php endwhile; ?>
								</ul>
							<?php endif; ?>
							<?php if ($top_recruiters = get_field('college_top_recruiters')): ?>
								<h3><?php esc_html_e('Top Recruiters:', 'collegenexis-theme'); ?></h3>
								<p><?php echo nl2br(esc_html($top_recruiters)); ?></p>
							<?php endif; ?>
						</section>
						<?php endif; ?>

						<?php if ($scholarships = get_field('college_scholarships')): ?>
						<section id="college-scholarships" class="college-section">
							<h2><?php esc_html_e('Scholarships', 'collegenexis-theme'); ?></h2>
							<?php echo wp_kses_post($scholarships); ?>
						</section>
						<?php endif; ?>

						<section id="college-media" class="college-section">
							<h2><?php esc_html_e('Media & Downloads', 'collegenexis-theme'); ?></h2>
							<?php if ($brochure = get_field('college_brochure_file')): ?>
								<p><a href="<?php echo esc_url($brochure['url']); ?>" target="_blank" class="button download-brochure"><?php esc_html_e('Download Brochure', 'collegenexis-theme'); ?></a> (<?php echo esc_html(strtoupper($brochure['subtype'])); ?>, <?php echo esc_html(size_format($brochure['filesize'])); ?>)</p>
							<?php endif; ?>

							<?php
							$gallery_images = get_field('college_campus_gallery');
							if ($gallery_images): ?>
								<h3><?php esc_html_e('Campus Gallery', 'collegenexis-theme'); ?></h3>
								<div class="college-gallery">
									<?php foreach ($gallery_images as $image): ?>
										<a href="<?php echo esc_url($image['url']); ?>" data-lightbox="college-gallery" data-title="<?php echo esc_attr($image['caption']); ?>">
											<img src="<?php echo esc_url($image['sizes']['medium']); ?>" alt="<?php echo esc_attr($image['alt']); ?>" />
										</a>
									<?php endforeach; ?>
								</div>
                                <p><small><?php esc_html_e('(Gallery functionality may require a lightbox plugin for optimal viewing)', 'collegenexis-theme'); ?></small></p>
							<?php endif; ?>
						</section>

					</div><!-- .entry-content -->

					<footer class="entry-footer">
						<?php edit_post_link(esc_html__('Edit This College', 'collegenexis-theme'), '<span class="edit-link">', '</span>'); ?>
					</footer><!-- .entry-footer -->
				</article><!-- #post-<?php the_ID(); ?> -->

				<?php
=======
				get_template_part( 'template-parts/content', get_post_type() ); // Uses content-college.php if it exists, otherwise content.php

				// If comments are open or we have at least one comment, load up the comment template.
				if ( comments_open() || get_comments_number() ) :
					comments_template();
				endif;

				the_post_navigation(
					array(
						'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous College:', 'collegenexis-theme' ) . '</span> <span class="nav-title">%title</span>',
						'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next College:', 'collegenexis-theme' ) . '</span> <span class="nav-title">%title</span>',
=======
						'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous:', 'collegenexis-theme' ) . '</span> <span class="nav-title">%title</span>',
						'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next:', 'collegenexis-theme' ) . '</span> <span class="nav-title">%title</span>',

					)
				);

			endwhile; // End of the loop.
			?>
		</div><!-- .container -->
	</main><!-- #main -->

<?php
get_footer();
