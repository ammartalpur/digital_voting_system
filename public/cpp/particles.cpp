#include <emscripten.h>
#include <emscripten/bind.h>
#include <string>

using namespace emscripten;

struct ParticleConfig
{
  int number_value;
  bool density_enable;
  int density_value_area;
  std::string color_value;
  std::string shape_type;
  float opacity_value;
  bool opacity_anim_enable;
  float opacity_anim_speed;
  float opacity_anim_opacity_min;
  bool opacity_anim_sync;
  float size_value;
  bool size_random;
  bool size_anim_enable;
  float size_anim_speed;
  float size_anim_size_min;
  bool size_anim_sync;
  bool line_linked_enable;
  int line_linked_distance;
  std::string line_linked_color;
  float line_linked_opacity;
  float line_linked_width;
  bool move_enable;
  float move_speed;
  std::string move_direction;
  std::string move_out_mode;
  bool move_bounce;
  bool interactivity_onhover_enable;
  std::string interactivity_onhover_mode;
  bool interactivity_onclick_enable;
  std::string interactivity_onclick_mode;
  bool retina_detect;
};

EMSCRIPTEN_BINDINGS(particle_config)
{
  value_object<ParticleConfig>("ParticleConfig")
      .field("number_value", &ParticleConfig::number_value)
      .field("density_enable", &ParticleConfig::density_enable)
      .field("density_value_area", &ParticleConfig::density_value_area)
      .field("color_value", &ParticleConfig::color_value)
      .field("shape_type", &ParticleConfig::shape_type)
      .field("opacity_value", &ParticleConfig::opacity_value)
      .field("opacity_anim_enable", &ParticleConfig::opacity_anim_enable)
      .field("opacity_anim_speed", &ParticleConfig::opacity_anim_speed)
      .field("opacity_anim_opacity_min", &ParticleConfig::opacity_anim_opacity_min)
      .field("opacity_anim_sync", &ParticleConfig::opacity_anim_sync)
      .field("size_value", &ParticleConfig::size_value)
      .field("size_random", &ParticleConfig::size_random)
      .field("size_anim_enable", &ParticleConfig::size_anim_enable)
      .field("size_anim_speed", &ParticleConfig::size_anim_speed)
      .field("size_anim_size_min", &ParticleConfig::size_anim_size_min)
      .field("size_anim_sync", &ParticleConfig::size_anim_sync)
      .field("line_linked_enable", &ParticleConfig::line_linked_enable)
      .field("line_linked_distance", &ParticleConfig::line_linked_distance)
      .field("line_linked_color", &ParticleConfig::line_linked_color)
      .field("line_linked_opacity", &ParticleConfig::line_linked_opacity)
      .field("line_linked_width", &ParticleConfig::line_linked_width)
      .field("move_enable", &ParticleConfig::move_enable)
      .field("move_speed", &ParticleConfig::move_speed)
      .field("move_direction", &ParticleConfig::move_direction)
      .field("move_out_mode", &ParticleConfig::move_out_mode)
      .field("move_bounce", &ParticleConfig::move_bounce)
      .field("interactivity_onhover_enable", &ParticleConfig::interactivity_onhover_enable)
      .field("interactivity_onhover_mode", &ParticleConfig::interactivity_onhover_mode)
      .field("interactivity_onclick_enable", &ParticleConfig::interactivity_onclick_enable)
      .field("interactivity_onclick_mode", &ParticleConfig::interactivity_onclick_mode)
      .field("retina_detect", &ParticleConfig::retina_detect);
}

ParticleConfig getParticleConfig()
{
  ParticleConfig config;
  config.number_value = 100;
  config.density_enable = true;
  config.density_value_area = 800;
  config.color_value = "#ffcc00";
  config.shape_type = "circle";
  config.opacity_value = 0.5;
  config.opacity_anim_enable = true;
  config.opacity_anim_speed = 1;
  config.opacity_anim_opacity_min = 0.1;
  config.opacity_anim_sync = false;
  config.size_value = 4;
  config.size_random = true;
  config.size_anim_enable = true;
  config.size_anim_speed = 5;
  config.size_anim_size_min = 0.1;
  config.size_anim_sync = false;
  config.line_linked_enable = true;
  config.line_linked_distance = 150;
  config.line_linked_color = "#ffcc00";
  config.line_linked_opacity = 0.4;
  config.line_linked_width = 1;
  config.move_enable = true;
  config.move_speed = 3;
  config.move_direction = "none";
  config.move_out_mode = "out";
  config.move_bounce = false;
  config.interactivity_onhover_enable = true;
  config.interactivity_onhover_mode = "repulse";
  config.interactivity_onclick_enable = true;
  config.interactivity_onclick_mode = "push";
  config.retina_detect = true;
  return config;
}

EMSCRIPTEN_BINDINGS(my_module)
{
  function("getParticleConfig", &getParticleConfig);
}