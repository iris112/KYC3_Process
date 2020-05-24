--private Long id;
--
--	@NotNull
--	@Size(max=65)
--	@Column(unique = true)
--	private String userName;
--	@NotNull
--	@Size(max=65)
--	private String firstName;
--	@NotNull
--	@Size(max=65)
--	private String lastName;
--	@NotNull
--	@Size(max=100)
--	@Column(unique = true)
--	private String email;
--	@NotNull
--	private String password;
--	@NotNull
--	private String passwordSalt;
--	private long createdAt;
--	@NotNull
--	private boolean isMuted = false;
--
--	@OneToOne(fetch = FetchType.EAGER,
--			cascade = CascadeType.ALL,
--			mappedBy = "userData")
--	@JsonManagedReference
--	private UserDetails details; // = new UserDetails(this);
--
--	@OneToOne(fetch = FetchType.EAGER,
--			cascade = CascadeType.ALL,
--			mappedBy = "userData")
--	@JsonManagedReference
--	private RiskResult riskResult; // = new RiskResult(this);
--
--	@OneToOne(fetch = FetchType.EAGER,
--			cascade = CascadeType.ALL,
--			mappedBy = "userData")
--	@JsonManagedReference
--	private Status status;// = new Status(this);
--
--	@OneToMany(
--			cascade = CascadeType.ALL,
--			orphanRemoval = true
--	)
--	private List<Role> role = new ArrayList<Role>();


create table user_data ( id SERIAL PRIMARY KEY, userName varchar(65) not null, email varchar(100) not null, firstName varchar(65), lastName varchar(65),
                pasword varchar(256), passwordSalt varchar(256), createdAt BIGINT, isMuted BOOLEAN, unique(username), unique(email))

create table user_roles (id SERIAL, user_data_id INTEGER REFERENCES user_data(id), role_name varchar(64), expiration_timestamp BIGINT,username VARCHAR(64));

create table user_details( id SERIAL PRIMARY KEY, user_data_id INTEGER REFERENCES user_data(id), taxCountry varchar(3), nationality varchar(3), dateOfBirth DATE,
                address varchar(100), walletAddress varchar(256), amount DOUBLE, currencyType varchar(50), sourceOfFunds varchar(65), registrationTimestamp BIGINT,
                onOwnBehalf BOOLEAN, nonUs BOOLEAN, nonChinese BOOLEAN, conditionsAgreement BOOLEAN, fullAndFactual BOOLEAN, exclusionStatement BOOLEAN,
                nonFATF BOOLEAN, acceptanceOfRiskDisclaimer BOOLEAN, telegramName varchar(65), twitterName varchar(65), linkedinProfile varchar(512), facebookProfile varchar(512),
                wordList varchar(256) ARRAY[5], proofOfResidence bytea, selfie bytea, passportBack bytea, passportFront bytea, selfieVideo bytea, kycStatus INTEGER, identityDocumentStatus varchar(25), proofOfResidenceStatus varchar(25), unique(user_data_id))

@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private int sanctionScore = 0;
	private int pepScore = 0;
	private double riskScore = 0.0;
	private double countryRisk;

//	@ElementCollection(fetch=FetchType.LAZY)
//	@CollectionTable(name = "sanction_details", joinColumns = @JoinColumn(name = "risk_result_id"))
    //@Column(name = "sanction_detail")
	@OneToMany(fetch = FetchType.EAGER,cascade=CascadeType.ALL)
	@JoinColumn(name="risk_result_id")
	private List<SanctionEntity> sanctionDetails; // = new ArrayList<SanctionEntity>();
	//@ElementCollection(fetch=FetchType.LAZY)
	//@CollectionTable(name = "pep_details", joinColumns = @JoinColumn(name = "risk_result_id"))
	@OneToMany(fetch = FetchType.EAGER,cascade=CascadeType.ALL)
	@JoinColumn(name="risk_result_id")
    //@Column(name = "pep_detail")
	private List<SanctionEntity> pepDetails; // = new ArrayList<SanctionEntity>();

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name="user_id")
	@JsonBackReference
	private UserData userData;


create table user_risk (id SERIAL PRIMARY KEY, user_data_id INTEGER REFERENCES user_data(id), sanctionScore INTEGER, pepScore INTEGER, riskScore DOUBLE, countryRisk DOUBLE, unique(user_data_id))

create table rounds (id SERIAL PRIMARY KEY, discount INTEGER, start_timestamp BIGINT, end_timestamp BIGINT, round INTEGER, tokens INTEGER, active BOOLEAN)

