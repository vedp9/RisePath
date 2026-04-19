(function(){
  var config = window.RisePathConfig || {};
  var LOCAL_KEYS = {
    students: 'rp_student_requests',
    mentors: 'rp_mentor_applications',
    waitlist: 'rp_waitlist_signups'
  };
  var client = null;

  function configured(value) {
    return value && typeof value === 'string' && value.indexOf('YOUR_') !== 0;
  }

  function cloudReady() {
    return configured(config.supabaseUrl) &&
      configured(config.supabaseAnonKey) &&
      !!(window.supabase && window.supabase.createClient);
  }

  function getClient() {
    if (!cloudReady()) return null;
    if (!client) {
      client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    }
    return client;
  }

  function loadLocal(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (err) {
      return [];
    }
  }

  function saveLocal(key, items) {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (err) {}
  }

  function upsertLocal(key, item) {
    var items = loadLocal(key);
    var idx = items.findIndex(function(entry){ return entry.id === item.id; });
    if (idx >= 0) items[idx] = item;
    else items.unshift(item);
    saveLocal(key, items);
    return item;
  }

  function studentToRow(item) {
    return {
      id: item.id,
      name: item.name,
      struggle: item.struggle,
      support_type: item.support,
      connection_preference: item.connection,
      matched_mentor: item.matchedMentor,
      matched_role: item.matchedRole,
      status: item.status,
      first_message: item.firstMessage || null,
      created_at: item.createdAt,
      updated_at: item.updatedAt
    };
  }

  function rowToStudent(row) {
    return {
      id: row.id,
      name: row.name,
      struggle: row.struggle,
      support: row.support_type,
      connection: row.connection_preference,
      matchedMentor: row.matched_mentor,
      matchedRole: row.matched_role,
      status: row.status,
      firstMessage: row.first_message || '',
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  function mentorToRow(item) {
    return {
      id: item.id,
      name: item.name,
      age: item.age ? Number(item.age) : null,
      city: item.city,
      current_role: item.role,
      story: item.story,
      support_areas: item.supports || [],
      available_days: item.days || [],
      available_times: item.times || [],
      hours_per_week: item.hours || '',
      connection_styles: item.connection || [],
      message: item.message,
      status: item.status,
      created_at: item.createdAt,
      updated_at: item.updatedAt
    };
  }

  function rowToMentor(row) {
    return {
      id: row.id,
      name: row.name,
      age: row.age,
      city: row.city,
      role: row.current_role,
      story: row.story,
      supports: row.support_areas || [],
      days: row.available_days || [],
      times: row.available_times || [],
      hours: row.hours_per_week || '',
      connection: row.connection_styles || [],
      message: row.message || '',
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  function waitlistToRow(item) {
    return {
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone || '',
      role: item.role,
      source: item.source,
      status: item.status,
      created_at: item.createdAt,
      updated_at: item.updatedAt
    };
  }

  function rowToWaitlist(row) {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone || '',
      role: row.role,
      source: row.source,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async function saveStudentRequest(item) {
    upsertLocal(LOCAL_KEYS.students, item);
    var supabase = getClient();
    if (!supabase) return item;
    var result = await supabase.from('student_requests').upsert(studentToRow(item), { onConflict: 'id' });
    if (result.error) console.error('student_requests upsert failed', result.error);
    return item;
  }

  async function saveMentorApplication(item) {
    upsertLocal(LOCAL_KEYS.mentors, item);
    var supabase = getClient();
    if (!supabase) return item;
    var result = await supabase.from('mentor_applications').upsert(mentorToRow(item), { onConflict: 'id' });
    if (result.error) console.error('mentor_applications upsert failed', result.error);
    return item;
  }

  async function saveWaitlistSignup(item) {
    upsertLocal(LOCAL_KEYS.waitlist, item);
    var supabase = getClient();
    if (!supabase) return item;
    var result = await supabase.from('waitlist_events').upsert(waitlistToRow(item), { onConflict: 'id' });
    if (result.error) console.error('waitlist_events upsert failed', result.error);
    return item;
  }

  async function listDashboardData() {
    var supabase = getClient();
    if (!supabase) {
      return {
        students: loadLocal(LOCAL_KEYS.students),
        mentors: loadLocal(LOCAL_KEYS.mentors),
        waitlist: loadLocal(LOCAL_KEYS.waitlist),
        mode: 'local'
      };
    }

    var responses = await Promise.all([
      supabase.from('student_requests').select('*').order('updated_at', { ascending: false }),
      supabase.from('mentor_applications').select('*').order('updated_at', { ascending: false }),
      supabase.from('waitlist_events').select('*').order('updated_at', { ascending: false })
    ]);

    var studentsRes = responses[0];
    var mentorsRes = responses[1];
    var waitlistRes = responses[2];

    if (studentsRes.error || mentorsRes.error || waitlistRes.error) {
      console.error('dashboard query failed', studentsRes.error || mentorsRes.error || waitlistRes.error);
      return {
        students: loadLocal(LOCAL_KEYS.students),
        mentors: loadLocal(LOCAL_KEYS.mentors),
        waitlist: loadLocal(LOCAL_KEYS.waitlist),
        mode: 'local'
      };
    }

    return {
      students: (studentsRes.data || []).map(rowToStudent),
      mentors: (mentorsRes.data || []).map(rowToMentor),
      waitlist: (waitlistRes.data || []).map(rowToWaitlist),
      mode: 'cloud'
    };
  }

  async function requestAdminMagicLink(email, redirectUrl) {
    var supabase = getClient();
    if (!supabase) {
      return { ok: false, error: 'Supabase is not configured yet.' };
    }
    var result = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    if (result.error) return { ok: false, error: result.error.message };
    return { ok: true };
  }

  async function getAdminSession() {
    var supabase = getClient();
    if (!supabase) return null;
    var result = await supabase.auth.getSession();
    if (result.error) {
      console.error('getSession failed', result.error);
      return null;
    }
    return result.data && result.data.session ? result.data.session : null;
  }

  async function signOutAdmin() {
    var supabase = getClient();
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  window.RisePathStore = {
    adminEmail: config.adminEmail,
    cloudReady: cloudReady,
    getClient: getClient,
    saveStudentRequest: saveStudentRequest,
    saveMentorApplication: saveMentorApplication,
    saveWaitlistSignup: saveWaitlistSignup,
    saveWaitlistEvent: saveWaitlistSignup,
    listDashboardData: listDashboardData,
    requestAdminMagicLink: requestAdminMagicLink,
    getAdminSession: getAdminSession,
    signOutAdmin: signOutAdmin
  };
})();
