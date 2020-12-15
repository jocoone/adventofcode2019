require('child_process').fork(
  `./challenges/${process.env.npm_config_year || 2020}/day${
    process.env.npm_config_day
  }.js`
);
