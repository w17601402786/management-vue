import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'


// 管理员页面
import Home_admin from './components/admin/Home.vue'
import Welcome_admin from './components/admin/Welcome.vue'
import Users from './components/admin/Users.vue'
import Classes from './components/admin/Classes.vue'
import Courses from './components/admin/Courses.vue'
import Opens from './components/admin/Opens.vue'
import Selections from './components/admin/Selections.vue'
import AddSelection from './components/admin/AddSelection.vue'
import Scores from './components/admin/Scores.vue'
import ScoresAnalysis from './components/admin/ScoresAnalysis.vue'
import CourseSchedule from './components/admin/CourseSchedule.vue'


// 学生页面
import Home_student from './components/student/Home.vue'
import Welcome_student from './components/student/Welcome.vue'
import Courses_Info from './components/student/Courses.vue'
import Select from './components/student/Select.vue'
import Analysis from './components/student/Analysis.vue'
import StudentInfo from './components/student/Info.vue'



// 教师页面
import Home_teacher from './components/teacher/Home.vue'
import Welcome_teacher from './components/teacher/Welcome.vue'
import teachingschedule from './components/teacher/teachingschedule.vue'
import Score from './components/teacher/Score.vue'
import dictionary from './components/teacher/dictionary.vue'
import InputScore from './components/teacher/InputScore.vue'
import TeacherInfo from './components/teacher/Info.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    // 重定向
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },

    // 管理员页面路由
    { path: '/admin', redirect: '/admin/home' },
    {
      path: '/admin/home',
      component: Home_admin,
      redirect: '/admin/welcome',
      children: [
        { path: '/admin/welcome', component: Welcome_admin },
        { path: '/admin/users', component: Users },
        { path: '/admin/classes', component: Classes },
        { path: '/admin/courses', component: Courses },
        { path: '/admin/opens', component: Opens },
        { path: '/admin/selections', component: Selections },
        { path: '/admin/addSelection', component: AddSelection },
        { path: '/admin/scores', component: Scores },
        { path: '/admin/courseSchedule', component: CourseSchedule },
        { path: '/admin/scoresAnalysis', component: ScoresAnalysis },
      ]
    },
    
    {
      path: '/student/home',
      component: Home_student,
      redirect: '/student/welcome',
      children: [
        { path: '/student/welcome', component: Welcome_student },
        { path: '/student/courses', component: Courses_Info },
        { path: '/student/select', component: Select },
        { path: '/student/Analysis', component: Analysis },
        { path: '/student/Info', component: StudentInfo },
      ]
    },
    {
      path: '/teacher/home',
      component: Home_teacher,
      redirect: '/teacher/welcome',//默认重定向到welcome
      children: [
          { path: '/teacher/welcome', component: Welcome_teacher },
          { path: '/teacher/teachingschedule', component: teachingschedule },
          { path: '/teacher/score', component: Score },
          { path: '/teacher/dictionary', component: dictionary },
          { path: '/teacher/inputScore', component: InputScore },
          { path: '/teacher/Info', component: TeacherInfo },
      ]
    },
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to:将要访问的路径
  // from:跳转来的路径
  // next:放行函数 next()放行  next('/login') 强制跳转
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('user');
  if (!tokenStr) return next('/login');
  next()
})
export default router