var settings = {
  development: {
    db: "/mnt/efs/fs1/notejam_dev.db",
    dsn: "sqlite://notejam_dev.db"
  },
  test: {
    db: "notejam_test.db",
    dsn: "sqlite://notejam_test.db"
  }
};


var env = process.env.NODE_ENV
if (!env) {
  env = 'development'
};
module.exports = settings[env];
