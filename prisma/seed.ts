import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { roleName: 'ADMIN' },
    update: {},
    create: {
      roleName: 'ADMIN',
    },
  });

  const userRole = await prisma.role.upsert({
    where: { roleName: 'USER' },
    update: {},
    create: {
      roleName: 'USER',
    },
  });

  console.log({ adminRole, userRole });

  const createDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'CREATE_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'CREATE_DISCUSSION',
      description: 'Can create a discussion',
    },
  });

  const getDiscussionsPermission = await prisma.permission.upsert({
    where: { permissionName: 'GET_DISCUSSIONS' },
    update: {},
    create: {
      permissionName: 'GET_DISCUSSIONS',
      description: 'Can get discussions',
    },
  });

  const updateOwnDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'UPDATE_OWN_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'UPDATE_OWN_DISCUSSION',
      description: 'Can update his own discussion',
    },
  });

  const updateAnyDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'UPDATE_ANY_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'UPDATE_ANY_DISCUSSION',
      description: 'Can update any discussion',
    },
  });

  const deleteOwnDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'DELETE_OWN_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'DELETE_OWN_DISCUSSION',
      description: 'Can delete his own discussion',
    },
  });

  const deleteAnyDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'DELETE_ANY_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'DELETE_ANY_DISCUSSION',
      description: 'Can delete any discussion',
    },
  });

  const reportDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'REPORT_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'REPORT_DISCUSSION',
      description: 'Can report a discussion',
    },
  });

  const getDiscussionReportsPermission = await prisma.permission.upsert({
    where: { permissionName: 'GET_DISCUSSION_REPORTS' },
    update: {},
    create: {
      permissionName: 'GET_DISCUSSION_REPORTS',
      description: 'Can get reported discussions',
    },
  });

  const changeDiscussionReportStatusPermission = await prisma.permission.upsert(
    {
      where: { permissionName: 'CHANGE_DISCUSSION_REPORT_STATUS' },
      update: {},
      create: {
        permissionName: 'CHANGE_DISCUSSION_REPORT_STATUS',
        description: 'Can change reported discussion status',
      },
    }
  );

  const createCommunityPermission = await prisma.permission.upsert({
    where: { permissionName: 'CREATE_COMMUNITY' },
    update: {},
    create: {
      permissionName: 'CREATE_COMMUNITY',
      description: 'Can create a community',
    },
  });

  const deleteCommunityPermission = await prisma.permission.upsert({
    where: { permissionName: 'DELETE_COMMUNITY' },
    update: {},
    create: {
      permissionName: 'DELETE_COMMUNITY',
      description: 'Can delete a community',
    },
  });

  const updateCommunityPermission = await prisma.permission.upsert({
    where: { permissionName: 'UPDATE_COMMUNITY' },
    update: {},
    create: {
      permissionName: 'UPDATE_COMMUNITY',
      description: 'Can update a community',
    },
  });

  const likeDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'LIKE_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'LIKE_DISCUSSION',
      description: 'Can like a discussion',
    },
  });

  const removeLikePermission = await prisma.permission.upsert({
    where: { permissionName: 'REMOVE_LIKE_FROM_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'REMOVE_LIKE_FROM_DISCUSSION',
      description: 'Can remove a like',
    },
  });

  const commentDiscussionPermission = await prisma.permission.upsert({
    where: { permissionName: 'COMMENT_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'COMMENT_DISCUSSION',
      description: 'Can comment on a discussion',
    },
  });

  const removeOwnCommentPermission = await prisma.permission.upsert({
    where: { permissionName: 'REMOVE_OWN_COMMENT_FROM_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'REMOVE_OWN_COMMENT_FROM_DISCUSSION',
      description: 'Can remove his own comment',
    },
  });

  const removeAnyCommentPermission = await prisma.permission.upsert({
    where: { permissionName: 'REMOVE_ANY_COMMENT_FROM_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'REMOVE_ANY_COMMENT_FROM_DISCUSSION',
      description: 'Can remove any comment',
    },
  });

  const likeCommentPermission = await prisma.permission.upsert({
    where: { permissionName: 'LIKE_COMMENT' },
    update: {},
    create: {
      permissionName: 'LIKE_COMMENT',
      description: 'Can like a comment',
    },
  });

  const removeLikeCommentPermission = await prisma.permission.upsert({
    where: { permissionName: 'REMOVE_LIKE_FROM_COMMENT' },
    update: {},
    create: {
      permissionName: 'REMOVE_LIKE_FROM_COMMENT',
      description: 'Can remove a like from a comment',
    },
  });

  const reportCommentPermission = await prisma.permission.upsert({
    where: { permissionName: 'REPORT_COMMENT' },
    update: {},
    create: {
      permissionName: 'REPORT_COMMENT',
      description: 'Can report a comment',
    },
  });

  const getCommentReportsPermission = await prisma.permission.upsert({
    where: { permissionName: 'GET_COMMENT_REPORTS' },
    update: {},
    create: {
      permissionName: 'GET_COMMENT_REPORTS',
      description: 'Can get comment reports',
    },
  });

  const changeCommentReportStatusPermission = await prisma.permission.upsert({
    where: { permissionName: 'CHANGE_COMMENT_REPORT_STATUS' },
    update: {},
    create: {
      permissionName: 'CHANGE_COMMENT_REPORT_STATUS',
      description: 'Can change comment report status',
    },
  });

  const addBookmarkPermission = await prisma.permission.upsert({
    where: { permissionName: 'ADD_BOOKMARK_TO_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'ADD_BOOKMARK_TO_DISCUSSION',
      description: 'Can add a bookmark',
    },
  });

  const removeBookmarkPermission = await prisma.permission.upsert({
    where: { permissionName: 'REMOVE_BOOKMARK_FROM_DISCUSSION' },
    update: {},
    create: {
      permissionName: 'REMOVE_BOOKMARK_FROM_DISCUSSION',
      description: 'Can remove a bookmark',
    },
  });

  const updateUserStatus = await prisma.permission.upsert({
    where: { permissionName: 'UPDATE_USER_STATUS' },
    update: {},
    create: {
      permissionName: 'UPDATE_USER_STATUS',
      description: 'Can update user status',
    },
  });

  const updateUserRole = await prisma.permission.upsert({
    where: { permissionName: 'UPDATE_USER_ROLE' },
    update: {},
    create: {
      permissionName: 'UPDATE_USER_ROLE',
      description: 'Can update user role',
    },
  });

  const getUsers = await prisma.permission.upsert({
    where: { permissionName: 'GET_USERS' },
    update: {},
    create: {
      permissionName: 'GET_USERS',
      description: 'Can get a list of users',
    },
  });

  const createLog = await prisma.permission.upsert({
    where: { permissionName: 'CREATE_LOG' },
    update: {},
    create: {
      permissionName: 'CREATE_LOG',
      description: 'Can create a log',
    },
  });

  const getLogs = await prisma.permission.upsert({
    where: { permissionName: 'GET_LOGS' },
    update: {},
    create: {
      permissionName: 'GET_LOGS',
      description: 'Can get logs',
    },
  });

  const closeTicket = await prisma.permission.upsert({
    where: { permissionName: 'CLOSE_TICKET' },
    update: {},
    create: {
      permissionName: 'CLOSE_TICKET',
      description: 'Can close a ticket',
    },
  });

  const followCommunity = await prisma.permission.upsert({
    where: { permissionName: 'FOLLOW_COMMUNITY' },
    update: {},
    create: {
      permissionName: 'FOLLOW_COMMUNITY',
      description: 'Can follow a community',
    },
  });

  const getAnyUserDetailsPermission = await prisma.permission.upsert({
    where: { permissionName: 'GET_ANY_USER_DETAILS' },
    update: {},
    create: {
      permissionName: 'GET_ANY_USER_DETAILS',
      description: 'Can get any user details',
    },
  });

  const getOwnUserDetailsPermission = await prisma.permission.upsert({
    where: { permissionName: 'GET_OWN_USER_DETAILS' },
    update: {},
    create: {
      permissionName: 'GET_OWN_USER_DETAILS',
      description: 'Can get own user details',
    },
  });

  const getPublicUserDetailsPermission = await prisma.permission.upsert({
    where: { permissionName: 'GET_PUBLIC_USER_DETAILS' },
    update: {},
    create: {
      permissionName: 'GET_PUBLIC_USER_DETAILS',
      description: 'Can get public user details',
    },
  });

  const getOwnNotificationsPermission = await prisma.permission.upsert({
    where: { permissionName: 'GET_OWN_NOTIFICATIONS' },
    update: {},
    create: {
      permissionName: 'GET_OWN_NOTIFICATIONS',
      description: 'Can get own notifications',
    },
  });

  const updateOwnNotificationsPermission = await prisma.permission.upsert({
    where: { permissionName: 'UPDATE_OWN_NOTIFICATIONS' },
    update: {},
    create: {
      permissionName: 'UPDATE_OWN_NOTIFICATIONS',
      description: 'Can update own notifications',
    },
  });

  const followUserPermission = await prisma.permission.upsert({
    where: { permissionName: 'FOLLOW_USER' },
    update: {},
    create: {
      permissionName: 'FOLLOW_USER',
      description: 'Can follow a user',
    },
  });

  const getAdminStatisticsPermission = await prisma.permission.upsert({
    where: { permissionName: 'GET_ADMIN_STATISTICS' },
    update: {},
    create: {
      permissionName: 'GET_ADMIN_STATISTICS',
      description: 'Can get admin statistics',
    },
  });

  const manageStockPermission = await prisma.permission.upsert({
    where: { permissionName: 'MANAGE_STOCKS' },
    update: {},
    create: {
      permissionName: 'MANAGE_STOCKS',
      description: 'Can manage stocks to favorite list',
    },
  });

  const getStocksDataPermission = await prisma.permission.upsert({
    where: { permissionName: 'GET_STOCKS_DATA' },
    update: {},
    create: {
      permissionName: 'GET_STOCKS_DATA',
      description: 'Can get stocks data',
    },
  });
  const rolePermissions = [
    {
      roleId: adminRole.id,
      permissions: [
        createDiscussionPermission.id,
        updateAnyDiscussionPermission.id,
        deleteAnyDiscussionPermission.id,
        reportDiscussionPermission.id,
        getDiscussionReportsPermission.id,
        likeDiscussionPermission.id,
        removeLikePermission.id,
        commentDiscussionPermission.id,
        removeAnyCommentPermission.id,
        likeCommentPermission.id,
        removeLikeCommentPermission.id,
        reportCommentPermission.id,
        getCommentReportsPermission.id,
        createCommunityPermission.id,
        deleteCommunityPermission.id,
        updateCommunityPermission.id,
        addBookmarkPermission.id,
        removeBookmarkPermission.id,
        changeCommentReportStatusPermission.id,
        changeDiscussionReportStatusPermission.id,
        updateUserStatus.id,
        createLog.id,
        getLogs.id,
        closeTicket.id,
        getUsers.id,
        updateUserRole.id,
        getDiscussionsPermission.id,
        followCommunity.id,
        getAnyUserDetailsPermission.id,
        getPublicUserDetailsPermission.id,
        updateOwnNotificationsPermission.id,
        followUserPermission.id,
        getOwnNotificationsPermission.id,
        getOwnUserDetailsPermission.id,
        getAdminStatisticsPermission.id,
        manageStockPermission.id,
        getStocksDataPermission.id,
      ],
    },

    {
      roleId: userRole.id,
      permissions: [
        createDiscussionPermission.id,
        updateOwnDiscussionPermission.id,
        deleteOwnDiscussionPermission.id,
        reportDiscussionPermission.id,
        likeDiscussionPermission.id,
        removeLikePermission.id,
        commentDiscussionPermission.id,
        removeOwnCommentPermission.id,
        likeCommentPermission.id,
        removeLikeCommentPermission.id,
        reportCommentPermission.id,
        addBookmarkPermission.id,
        removeBookmarkPermission.id,
        getDiscussionsPermission.id,
        followCommunity.id,
        getOwnUserDetailsPermission.id,
        getPublicUserDetailsPermission.id,
        getOwnNotificationsPermission.id,
        updateOwnNotificationsPermission.id,
        followUserPermission.id,
        manageStockPermission.id,
        getStocksDataPermission.id,
      ],
    },
  ];

  const data = rolePermissions.flatMap(({ roleId, permissions }) =>
    permissions.map((permissionId) => ({
      roleId,
      permissionId,
    }))
  );

  await prisma.rolePermission.createMany({
    data,
    skipDuplicates: true,
  });

  // seeding communities
  const userId = 3; // admin user

  // Seeding communities

  const economicAnalysis = await prisma.community.upsert({
    where: { name: 'Analiză Economică' },
    update: {},
    create: {
      name: 'Analiză Economică',
      description:
        'Un loc pentru a discuta despre indicatorii economici globali, piețele internaționale și tendințele macroeconomice care influențează economia mondială.',
      user: {
        connect: { id: userId },
      },
    },
  });

  const personalFinance = await prisma.community.upsert({
    where: { name: 'Finanțe Personale' },
    update: {},
    create: {
      name: 'Finanțe Personale',
      description:
        'Un spațiu pentru a împărtăși sfaturi și strategii pentru gestionarea finanțelor personale, economisire și investiții.',
      user: {
        connect: { id: userId },
      },
    },
  });

  const stockMarket = await prisma.community.upsert({
    where: { name: 'Bursa de Valori' },
    update: {},
    create: {
      name: 'Bursa de Valori',
      description:
        'Un loc pentru a analiza și discuta despre acțiuni, ETF-uri și strategii de investiții pe piețele financiare.',
      user: {
        connect: { id: userId },
      },
    },
  });

  const fiscalMeasures = await prisma.community.upsert({
    where: { name: 'Măsuri Fiscale' },
    update: {},
    create: {
      name: 'Măsuri Fiscale',
      description:
        'O comunitate pentru a analiza și discuta măsurile fiscale actuale, politicile guvernamentale și impactul lor asupra economiei.',
      user: {
        connect: { id: userId },
      },
    },
  });

  const studentCorner = await prisma.community.upsert({
    where: { name: 'Spațiul Studenților' },
    update: {},
    create: {
      name: 'Spațiul Studenților',
      description:
        'Un loc unde studenții pot discuta despre teme economice, resurse utile pentru facultate și sfaturi pentru gestionarea bugetului.',
      user: {
        connect: { id: userId },
      },
    },
  });

  console.log({
    economicAnalysis,
    personalFinance,
    stockMarket,
    fiscalMeasures,
    studentCorner,
  });

  // users
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash('User123.', saltRounds);

  await prisma.user.createMany({
    data: [
      {
        firstName: 'Alexandru',
        lastName: 'Popescu',
        username: 'alex.popescu',
        email: 'alex.popescu@example.com',
        gender: 'MALE',
        birthDate: new Date('1990-03-15'),
        password: hashedPassword,
        roleId: 2,
        status: 'ACTIVE',
      },
      {
        firstName: 'Ioana',
        lastName: 'Ionescu',
        username: 'ioana.ionescu',
        email: 'ioana.ionescu@example.com',
        gender: 'FEMALE',
        birthDate: new Date('1987-07-22'),
        password: hashedPassword,
        roleId: 2,
        status: 'ACTIVE',
      },
      {
        firstName: 'Mihai',
        lastName: 'Dumitru',
        username: 'mihai.dumitru',
        email: 'mihai.dumitru@example.com',
        gender: 'MALE',
        birthDate: new Date('1995-11-08'),
        password: hashedPassword,
        roleId: 2,
        status: 'ACTIVE',
      },
      {
        firstName: 'Andreea',
        lastName: 'Marin',
        username: 'andreea.marin',
        email: 'andreea.marin@example.com',
        gender: 'FEMALE',
        birthDate: new Date('1992-02-14'),
        password: hashedPassword,
        roleId: 2,
        status: 'ACTIVE',
      },
      {
        firstName: 'Gabriel',
        lastName: 'Constantin',
        username: 'gabriel.constantin',
        email: 'gabriel.constantin@example.com',
        gender: 'MALE',
        birthDate: new Date('1989-05-03'),
        password: hashedPassword,
        roleId: 2,
        status: 'ACTIVE',
      },
      {
        firstName: 'Elena',
        lastName: 'Stan',
        username: 'elena.stan',
        email: 'elena.stan@example.com',
        gender: 'FEMALE',
        birthDate: new Date('1993-09-18'),
        password: hashedPassword,
        roleId: 2,
        status: 'ACTIVE',
      },
      {
        firstName: 'Radu',
        lastName: 'Mocanu',
        username: 'radu.mocanu',
        email: 'radu.mocanu@example.com',
        gender: 'MALE',
        birthDate: new Date('1991-12-30'),
        password: hashedPassword,
        roleId: 2,
        status: 'ACTIVE',
      },
      {
        firstName: 'Cristina',
        lastName: 'Neagu',
        username: 'cristina.neagu',
        email: 'cristina.neagu@example.com',
        gender: 'FEMALE',
        birthDate: new Date('1988-06-25'),
        password: hashedPassword,
        roleId: 2,
        status: 'ACTIVE',
      },
    ],
  });

  //
  // discussions
  const discussions = [
    {
      title: 'Impactul inflației asupra economiei globale',
      content:
        'Inflația este un subiect de actualitate ce influențează economiile mondiale. Ratele dobânzilor sunt ajustate pentru a controla efectele asupra piețelor financiare și asupra puterii de cumpărare a consumatorilor.',
      communityId: 1,
    },
    {
      title: 'Strategii eficiente pentru economisire',
      content:
        'Economisirea banilor este esențială pentru securitatea financiară. Aplicarea regulii 50/30/20 sau folosirea automatizării poate ajuta la gestionarea eficientă a resurselor financiare.',
      communityId: 2,
    },
    {
      title: 'Analiza companiilor listate la bursă',
      content:
        'Investitorii analizează rapoartele financiare și indicatori precum EBITDA sau P/E Ratio pentru a evalua performanța companiilor listate pe bursă.',
      communityId: 3,
    },
    {
      title: 'Modificări recente ale codului fiscal',
      content:
        'În ultimul an, guvernul a introdus noi reglementări fiscale, incluzând creșteri de taxe și măsuri pentru sprijinirea întreprinderilor mici și mijlocii.',
      communityId: 4,
    },
    {
      title: 'Oportunități și burse pentru studenți',
      content:
        'Studenții au acces la burse naționale și internaționale care acoperă taxe de școlarizare, cazare și alte costuri academice.',
      communityId: 5,
    },
    {
      title: 'Piața muncii și impactul recesiunilor',
      content:
        'Recesiunile economice pot duce la creșterea șomajului și la o scădere a oportunităților de angajare, afectând direct veniturile populației.',
      communityId: 1,
    },
    {
      title: 'Sfaturi pentru gestionarea bugetului personal',
      content:
        'Crearea unui buget lunar și reducerea cheltuielilor inutile sunt pași esențiali pentru a avea un control mai bun asupra finanțelor personale.',
      communityId: 2,
    },
    {
      title: 'Cum să analizezi o acțiune înainte de a investi',
      content:
        'Analiza fundamentală și tehnică sunt metode utilizate de investitori pentru a lua decizii informate pe piața de capital.',
      communityId: 3,
    },
    {
      title: 'Impozitarea progresivă vs. impozitarea unică',
      content:
        'Sistemele de impozitare progresivă pot reduce inegalitățile sociale, dar pot descuraja investițiile mari.',
      communityId: 4,
    },
    {
      title: 'Surse alternative de venit pentru studenți',
      content:
        'Pe lângă burse, studenții pot câștiga bani prin freelancing, internshipuri plătite sau inițierea unor mici afaceri.',
      communityId: 5,
    },
    {
      title: 'Evoluția criptomonedelor pe piața globală',
      content:
        'Piața criptomonedelor a cunoscut creșteri și scăderi masive în ultimii ani, influențate de reglementări și adopția instituțională.',
      communityId: 1,
    },
    {
      title: 'Investiții în ETF-uri: avantaje și riscuri',
      content:
        'ETF-urile oferă diversificare și costuri reduse, dar expun investitorii la fluctuațiile generale ale pieței.',
      communityId: 2,
    },
    {
      title: 'Rolul băncilor centrale în economia globală',
      content:
        'Băncile centrale reglementează politica monetară și gestionează inflația prin ajustarea ratelor dobânzii și a masei monetare.',
      communityId: 3,
    },
    {
      title: 'Schimbările TVA și efectele asupra consumatorilor',
      content:
        'O creștere a TVA-ului poate duce la scumpiri în lanț, afectând puterea de cumpărare a cetățenilor.',
      communityId: 4,
    },
    {
      title: 'Joburi part-time pentru studenți în domeniul economic',
      content:
        'Studenții pot accesa oportunități de angajare în domeniul bancar, consultanță financiară sau asigurări.',
      communityId: 5,
    },
    {
      title: 'Piața imobiliară: creșteri sau scăderi?',
      content:
        'Prețurile locuințelor sunt influențate de factori economici precum dobânzile la credite și cererea de pe piață.',
      communityId: 1,
    },
    {
      title: 'Cum să îți diversifici portofoliul de investiții',
      content:
        'Diversificarea reduce riscurile și ajută la maximizarea randamentului investițiilor.',
      communityId: 2,
    },
    {
      title: 'Cele mai profitabile sectoare bursiere în 2025',
      content:
        'Tehnologia, energia regenerabilă și sănătatea sunt considerate domenii de investiții promițătoare.',
      communityId: 3,
    },
    {
      title: 'Cum influențează politica fiscală creșterea economică?',
      content:
        'Reducerea taxelor poate stimula consumul și investițiile, dar poate duce și la creșterea deficitului bugetar.',
      communityId: 4,
    },
    {
      title: 'Surse de finanțare pentru proiecte studențești',
      content:
        'Studenții pot accesa granturi, crowdfunding și fonduri europene pentru proiectele lor academice.',
      communityId: 5,
    },
  ];

  for (const discussion of discussions) {
    const users = await prisma.user.findMany();
    const randomUser = users[Math.floor(Math.random() * users.length)];
    await prisma.discussion.create({
      data: {
        title: discussion.title,
        content: discussion.content,
        userId: randomUser.id,
        communityId: discussion.communityId,
      },
    });
  }

  //
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
