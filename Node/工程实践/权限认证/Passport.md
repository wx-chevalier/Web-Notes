# 基于 Passport.js 的权限认证

参考了 [Passport.js 学习笔记](http://ju.outofmemory.cn/entry/99459)与 [Wiki.js](https://github.com/Requarks/wiki) 的源代码

认证又称 “ 验证 ”、“ 鉴权 ”，是指通过一定的手段，完成对用户身份的确认。身份验证的方法有很多，基本上可分为：基于共享密钥的身份验证、基于生物学特征的身份验证和基于公开密钥加密算法的身份验证。

登陆认证，是用户在访问应用或者网站时，通过是先注册的用户名和密码，告诉应用使用者的身份，从而获得访问权限的一种操作。

几乎所有的应用都需要登陆认证！ Passport.js 是 Node.js 中的一个做登录验证的中间件，极其灵活和模块化，并且可与 Express、Sails 等 Web 框架无缝集成。Passport 功能单一，即只能做登录验证，但非常强大，支持本地账号验证和第三方账号登录验证(OAuth 和 OpenID 等)，支持大多数 Web 网站和服务。

策略(Strategy )是 passport 中最重要的概念。passport 模块本身不能做认证，所有的认证方法都以策略模式封装为插件，需要某种认证时将其添加到 package.json 即可。策略模式是一种设计模式，它将算法和对象分离开来，通过加载不同的算法来实现不同的行为，适用于相关类的成员相同但行为不同的场景，比如在 passport 中，认证所需的字段都是用户名、邮箱、密码等，但认证方法是不同的。依据策略模式，passport 支持了众多的验证方案，包括 Basic、Digest 、 OAuth(1.0 ，和 2.0 的三种实现)、 JWT 等。

# 策略配置

## 本地认证

```js
const LocalStrategy = require('passport-local').Strategy;

passport.use(
  'local',

  new LocalStrategy(
    {
      usernameField: 'email',

      passwordField: 'password'
    },

    (uEmail, uPassword, done) => {
      db.User.findOne({ email: uEmail, provider: 'local' })

        .then(user => {
          if (user) {
            // validatePassword 是 User 模型自带的数据校验辅助函数

            return user

              .validatePassword(uPassword)

              .then(() => {
                return done(null, user) || true;
              })

              .catch(err => {
                return done(err, null);
              });
          } else {
            return done(new Error('INVALID_LOGIN'), null);
          }
        })

        .catch(err => {
          done(err, null);
        });
    }
  )
);
```

如果使用 MySQL、PostgreSQL 等关系型数据库，我们也可以进行

```js
// 绑定对于用户密码进行加密的操作

userSchema.statics.hashPassword = rawPwd => {
  return bcrypt.hash(rawPwd);
};

// 绑定对于密码的验证操作

userSchema.methods.validatePassword = function(rawPwd) {
  return bcrypt.compare(rawPwd, this.password).then(isValid => {
    return isValid
      ? true
      : Promise.reject(new Error(lang.t('auth:errors:invalidlogin')));
  });
};
```

注意，这里的字段名称应该是页面表单提交的名称，即 `req.body.xxx`，而不是 user 数据库中的字段名称。

将 options 作为 LocalStrategy 第一个参数传入即可。

passport 本身不处理验证，验证方法在策略配置的回调函数里由用户自行设置，它又称为验证回调。验证回调需要返回验证结果，这是由 done() 来完成的。

在 passport.use() 里面，done() 有三种用法：

当发生系统级异常时，返回 done(err)，这里是数据库查询出错，一般用 next(err)，但这里用 done(err)，两者的效果相同，都是返回 error 信息；当验证不通过时，返回 done(null, false, message)，这里的 message 是可选的，可通过 express-flash 调用；当验证通过时，返回 done(null, user)。

## 混合策略

```js
const passport = require('passport')

, LocalStrategy = require('passport-local').Strategy

, AnonymousStrategy = require('passport-anonymous').Strategy;

...



// 匿名登录认证作为本地认证的 fallback

passport.use(new AnonymousStrategy());

...

app.get('/',

passport.authenticate(['local', 'anonymous'], { session: false }),

function(req, res){

if (req.user) {

res.json({ msg: "用户已登录"});

} else {

res.json({ msg: "用户以匿名方式登录"});

}

});
```

# 框架集成

## 登录认证

```js
const express = require('express');

const cookieParser = require('cookie-parser');

const session = require('express-session');

const flash = require('express-flash');

const passport = require('passport');



...

// 在使用 app.use 之前需要进行 passport 的配置



app.use(cookieParser());

app.use(session({...}));

app.use(flash())

app.use(passport.initialize());

app.use(passport.session());



...



const ExpressBrute = require('express-brute')

const ExpressBruteMongooseStore = require('express-brute-mongoose')
```

```js
app.post(
  '/login',

  passport.authenticate('local', {
    successRedirect: '/',

    failureRedirect: '/login',

    failureFlash: true
  }),

  function(req, res) {
    // 验证成功则调用此回调函数

    res.redirect('/users/' + req.user.username);
  }
);
```

```js
// controllers/auth.js



...



// 使用 ExpressBruteMongooseStore 来存放爆破信息，也可以使用 MemoryStore 将信息存放于内存

const EBstore = new ExpressBruteMongooseStore(db.Bruteforce)

const bruteforce = new ExpressBrute(EBstore, {

freeRetries: 5,

minWait: 60 * 1000,

maxWait: 5 * 60 * 1000,

refreshTimeoutOnRequest: false,

failCallback (req, res, next, nextValidRequestDate) {

req.flash('alert', {

class: 'error',

title: lang.t('auth:errors.toomanyattempts'),

message: lang.t('auth:errors.toomanyattemptsmsg', { time: moment(nextValidRequestDate).fromNow() }),

iconClass: 'fa-times'

})

res.redirect('/login')

}

})



// 处理来自表单提交中包含的登录信息

router.post('/login', bruteforce.prevent, function (req, res, next) {

new Promise((resolve, reject) => {

// [1] LOCAL AUTHENTICATION

passport.authenticate('local', function (err, user, info) {

if (err) { return reject(err) }

if (!user) { return reject(new Error('INVALID_LOGIN')) }

resolve(user)

})(req, res, next)

}).then((user) => {

// LOGIN SUCCESS

// 执行用户登录操作，将用户 ID 写入到 Session 中

return req.logIn(user, function (err) {

if (err) { return next(err) }

req.brute.reset(function () {

return res.redirect('/')

})

}) || true

}).catch(err => {

// LOGIN FAIL

if (err.message === 'INVALID_LOGIN') {

req.flash('alert', {

title: lang.t('auth:errors.invalidlogin'),

message: lang.t('auth:errors.invalidloginmsg')

})

return res.redirect('/login')

} else {

req.flash('alert', {

title: lang.t('auth:errors.loginerror'),

message: err.message

})

return res.redirect('/login')

}

})

})



...
```

```js
const router = express.Router();
```

[koa-passport](https://github.com/rkusa/koa-passport)

```js
// body parser

const bodyParser = require('koa-bodyparser');

app.use(bodyParser());

// Sessions

const session = require('koa-session');

app.keys = ['secret'];

app.use(session({}, app));

const passport = require('koa-passport');

app.use(passport.initialize());

app.use(passport.session());
```

## 访问校验

注意上面的代码里有个 req.logIn()，它不是 http 模块原生的方法，也不是 express 中的方法，而是 passport 加上的，passport 扩展了 HTTP request，添加了四种方法。

logIn(user, options, callback) ：用 login() 也可以。作用是为登录用户初始化 session。options 可设置 session 为 false，即不初始化 session，默认为 true。logOut() ：别名为 logout()。作用是登出用户，删除该用户 session。不带参数。isAuthenticated() ：不带参数。作用是测试该用户是否存在于 session 中(即是否已登录)。若存在返回 true。事实上这个比登录验证要用的更多，毕竟 session 通常会保留一段时间，在此期间判断用户是否已登录用这个方法就行了。isUnauthenticated() ：不带参数。和上面的作用相反。

验证用户提交的凭证是否正确，是与 session 中储存的对象进行对比，所以涉及到从 session 中存取数据，需要做 session 对象序列化与反序列化。调用代码如下：

```js
// 获取用户编号，用于在 logIn 方法执行时向 Session 中写入用户编号，ID 或者 Token 皆可

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

// 根据 ID 查找用户，也是为了判断用户是否存在

passport.deserializeUser(function(id, done) {
  db.User.findById(id)

    .then(user => {
      if (user) {
        done(null, user);
      } else {
        done(new Error(lang.t('auth:errors:usernotfound')), null);
      }

      return true;
    })

    .catch(err => {
      done(err, null);
    });
});
```

这里第一段代码是将环境中的 user.id 序列化到 session 中，即 sessionID，同时它将作为凭证存储在用户 cookie 中。

第二段代码是从 session 反序列化，参数为用户提交的 sessionID，若存在则从数据库中查询 user 并存储与 req.user 中。

```js
//这里getUser方法需要自定义

app.get('/user', isAuthenticated, getUser);

// 将req.isAuthenticated()封装成中间件

module.exports = (req, res, next) => {
  // 判断用户是否经过认证

  if (!req.isAuthenticated()) {
    if (req.app.locals.appconfig.public !== true) {
      return res.redirect('/login');
    } else {
      req.user = rights.guest;

      res.locals.isGuest = true;
    }
  } else {
    res.locals.isGuest = false;
  }

  // 进行角色的权限校验

  res.locals.rights = rights.check(req);

  if (!res.locals.rights.read) {
    return res.render('error-forbidden');
  }

  // Expose user data

  res.locals.user = req.user;

  return next();
};
```

```js
app.get('/logout', function(req, res) {
  req.logout();

  res.redirect('/');
});
```

# OAuth

```
* OAuth 验证策略概述

*

* 当用户点击 “ 使用 XX 登录 ” 链接

* * 若用户已登录

* * 检查该用户是否已绑定 XX 服务

*     - 如果已绑定，返回错误(不允许账户合并)

*     - 否则开始验证流程，为该用户绑定XX服务

* * 用户未登录

* * 检查是否老用户

*     - 如果是老用户，则登录

*     - 否则检查OAuth返回profile中的email，是否在用户数据库中存在

*       - 如果存在，返回错误信息

*       - 否则创建一个新账号
```

```js
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;



passport.use('provider', new OAuth2Strategy({

authorizationURL: 'https://www.provider.com/oauth2/authorize',

tokenURL: 'https://www.provider.com/oauth2/token',

clientID: '123-456-789',

clientSecret: 'shhh-its-a-secret'

callbackURL: 'https://www.example.com/auth/provider/callback'

},

function(accessToken, refreshToken, profile, done) {

User.findOrCreate(..., function(err, user) {

done(err, user);

});

}

));
```

refreshToken 是重新获取 access token 的方法，因为 access token 是有使用期限的，到期了必须让用户重新授权才行，现在有了 refresh token，你可以让应用定期的用它去更新 access token，这样第三方服务就可以一直绑定了。不过这个方法并不是每个服务商都提供，注意看服务商的文档。

```js
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(
  'github',

  new GitHubStrategy(
    {
      clientID: appconfig.auth.github.clientId,

      clientSecret: appconfig.auth.github.clientSecret,

      callbackURL: appconfig.host + '/login/github/callback',

      scope: ['user:email']
    },

    (accessToken, refreshToken, profile, cb) => {
      db.User.processProfile(profile)

        .then(user => {
          return cb(null, user) || true;
        })

        .catch(err => {
          return cb(err, null) || true;
        });
    }
  )
);
```

```js
router.get(
  '/login/ms',

  passport.authenticate('windowslive', {
    scope: ['wl.signin', 'wl.basic', 'wl.emails']
  })
);

router.get(
  '/login/google',

  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/login/facebook',

  passport.authenticate('facebook', { scope: ['public_profile', 'email'] })
);

router.get(
  '/login/github',

  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/login/slack',

  passport.authenticate('slack', {
    scope: ['identity.basic', 'identity.email']
  })
);

router.get('/login/azure', passport.authenticate('azure_ad_oauth2'));

router.get(
  '/login/ms/callback',

  passport.authenticate('windowslive', {
    failureRedirect: '/login',

    successRedirect: '/'
  })
);

router.get(
  '/login/google/callback',

  passport.authenticate('google', {
    failureRedirect: '/login',

    successRedirect: '/'
  })
);

router.get(
  '/login/facebook/callback',

  passport.authenticate('facebook', {
    failureRedirect: '/login',

    successRedirect: '/'
  })
);

router.get(
  '/login/github/callback',

  passport.authenticate('github', {
    failureRedirect: '/login',

    successRedirect: '/'
  })
);

router.get(
  '/login/slack/callback',

  passport.authenticate('slack', {
    failureRedirect: '/login',

    successRedirect: '/'
  })
);

router.get(
  '/login/azure/callback',

  passport.authenticate('azure_ad_oauth2', {
    failureRedirect: '/login',

    successRedirect: '/'
  })
);
```

[Passport-GitHub strategy.js](https://github.com/jaredhanson/passport-github/blob/master/lib/strategy.js)

passport 以插件的形式支持了很多第三方网站和服务的 OAuth 验证，但并不是所有的，如果你需要在 app 中用到第三方的服务，但它们没有对应的 passport 插件，你可以用通用的 OAuth 或其他验证方法来进行验证，也可以将它们封装成 passport-x 插件。
