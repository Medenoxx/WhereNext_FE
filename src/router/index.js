import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Profile from '@/views/Profile.vue';
import Events from '@/views/Events.vue';
import CreateEvent from '@/views/CreateEvent.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import EventList from '@/views/EventList.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/events', name: 'Events', component: Events, meta: { requiresAuth: true } },
  { path: '/events/create', name: 'CreateEvent', component: CreateEvent, meta: { requiresAuth: true } },
  { path: '/events/list', name: 'EventList', component: EventList, meta: { requiresAuth: true } },
  {
    path: '/events/details/:id',
    name: 'EventDetails',
    component: () => import('@/views/EventDetails.vue'),
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (to, from, next) => {
      // Remove the token from localStorage to log the user out
      localStorage.removeItem('token');

      // Redirect to the login or home page after logout
      router.push('/');
    }
  },
  {
    path: '/admin/comments',
    name: 'ManageComments',
    component: () => import('@/views/ManageComments.vue'),
    meta: { requiresAuth: true },
  },
  // Füge hier weitere Routen hinzu, falls vorhanden
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Route Guard für Authentifizierung
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');  // Prüfe, ob ein Token im localStorage gespeichert ist

  // Wenn die Route eine Authentifizierung erfordert und kein Token vorhanden ist
  if (to.meta.requiresAuth && !token) {
    next('/login');  // Wenn der Benutzer nicht eingeloggt ist, leite auf die Login-Seite um
  } else {
    next();  // Andernfalls erlaube den Zugriff auf die Route
  }
});

export default router;
