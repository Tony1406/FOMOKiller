CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user', 
    avatar_url VARCHAR(255),
    banner_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);

CREATE TABLE games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_year INT,
    developer VARCHAR(100),
    image_url VARCHAR(255), 
    trailer_url VARCHAR(255), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);

CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE platforms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE game_genres (
    game_id INT,
    genre_id INT,
    PRIMARY KEY (game_id, genre_id),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

CREATE TABLE game_platforms (
    game_id INT,
    platform_id INT,
    PRIMARY KEY (game_id, platform_id),
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

CREATE TABLE user_games (
    user_id INT,
    game_id INT,
    status ENUM('LIKED', 'DISLIKED', 'COMPLETED', 'DROPPED') NOT NULL, 
    is_priority BOOLEAN DEFAULT FALSE, 
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_finished BOOLEAN DEFAULT FALSE, 
    PRIMARY KEY (user_id, game_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

CREATE TABLE user_platforms (
    user_id INT,
    platform_id INT,
    PRIMARY KEY (user_id, platform_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
);

CREATE TABLE collections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    is_system BOOLEAN DEFAULT TRUE 
);

CREATE TABLE collection_games (
    collection_id INT,
    game_id INT,
    PRIMARY KEY (collection_id, game_id),
    FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

CREATE TABLE friendships (
    user_id_1 INT,
    user_id_2 INT,
    status ENUM('PENDING', 'ACCEPTED', 'BLOCKED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id_1, user_id_2),
    FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT,
    recommended_game_id INT DEFAULT NULL, 
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recommended_game_id) REFERENCES games(id) ON DELETE SET NULL
);

INSERT INTO users (username, email, password_hash, role, avatar_url) VALUES
('SlayerX', 'slayer@test.com', '$2b$10$X7...', 'admin', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=SlayerX'),
('CozyFarm', 'cozy@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CozyFarm'),
('ShooterPro', 'fps@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ShooterPro'),
('RetroDave', 'dave@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=RetroDave'),
('SonyPony', 'sony@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=SonyPony'),
('NintyGirl', 'mario@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=NintyGirl'),
('PCMaster', 'rgb@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=PCMaster'),
('CasualDad', 'dad@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=CasualDad'),
('HorrorFan', 'boo@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=HorrorFan'),
('IndieHipster', 'indie@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=IndieHipster'),
('FIFA_King', 'fut@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=FIFA_King'),
('LoreSeeker', 'book@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=LoreSeeker'),
('SpeedRunner', 'fast@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=SpeedRunner'),
('MobileGamer', 'phone@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=MobileGamer'),
('Strategist', 'civ@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Strategist'),
('JRPG_Fan', 'weeb@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=JRPG_Fan'),
('Explorer', 'open@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Explorer'),
('Achievement', 'plat@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Achievement'),
('OldSchool', 'boomer@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=OldSchool'),
('TechDemo', 'demo@test.com', '$2b$10$X7...', 'user', 'https://api.dicebear.com/7.x/pixel-art/svg?seed=TechDemo');

INSERT INTO games (id, title, developer, release_year, description, image_url, trailer_url) VALUES
(1, 'Apex Legends', 'Respawn Entertainment', 2019, 'Battle royale free-to-play con leyendas de habilidades únicas. 60 jugadores en escuadrones de 3 compiten en mapas con movimiento fluido al estilo Titanfall. El mejor battle royale del mercado.', 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg', 'https://www.youtube.com/results?search_query=Apex+Legends'),
(2, 'PUBG: Battlegrounds', 'Krafton', 2022, 'El battle royale original que popularizó el género. Realismo táctico con 100 jugadores, mapas icónicos como Erangel y Miramar, y una curva de aprendizaje exigente que recompensa la paciencia.', 'https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg', 'https://www.youtube.com/results?search_query=PUBG:+Battlegrounds'),
(3, 'Fall Guys', 'Mediatonic', 2022, 'Battle royale caótico y colorido con minijuegos de obstáculos para hasta 60 jugadores en rondas eliminatorias. Completamente gratuito desde 2022. Perfecto para partidas rápidas y sociales.', 'https://cdn.akamai.steamstatic.com/steam/apps/1097150/header.jpg', 'https://www.youtube.com/results?search_query=Fall+Guys'),
(4, 'Naraka: Bladepoint', '24 Entertainment', 2023, 'Battle royale de combate cuerpo a cuerpo con gancho de agarre, habilidades únicas y estética de artes marciales orientales de alto nivel gráfico. Único en su propuesta dentro del género.', 'https://cdn.akamai.steamstatic.com/steam/apps/1203220/header.jpg', 'https://www.youtube.com/results?search_query=Naraka:+Bladepoint'),
(5, 'The Finals', 'Embark Studios', 2023, 'Shooter de arena gratuito de Embark Studios. Combates en equipos de 3 en torneos televisados con destrucción masiva de entornos y resurrección de compañeros caídos. Gran apuesta del free-to-play.', 'https://cdn.akamai.steamstatic.com/steam/apps/2073570/header.jpg', 'https://www.youtube.com/results?search_query=The+Finals'),
(6, 'Warhammer 40K: Darktide', 'Fatshark', 2022, 'Cooperativo de Warhammer 40K para cuatro jugadores que defienden la Fortaleza-Colmena de hordas de zombis nurgle. Atmósfera oscura y brutal, el mejor juego de la franquicia 40K en años.', 'https://cdn.akamai.steamstatic.com/steam/apps/1361210/header.jpg', 'https://www.youtube.com/results?search_query=Warhammer+40K:+Darktide'),
(7, 'Realm Royale Reforged', 'Hi-Rez Studios', 2022, 'Battle royale de fantasía con clases, habilidades mágicas y la icónica mecánica de convertirse en gallina al morir. Forja tus armas en plena batalla y domina el campo con tu clase elegida.', 'https://cdn.akamai.steamstatic.com/steam/apps/813820/header.jpg', 'https://www.youtube.com/results?search_query=Realm+Royale+Reforged'),
(8, 'Counter-Strike 2', 'Valve', 2023, 'La evolución de CS:GO con motor Source 2, humo volumétrico dinámico y gráficos renovados. El shooter táctico competitivo por excelencia con décadas de legado esportivo activo.', 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg', 'https://www.youtube.com/results?search_query=Counter-Strike+2'),
(9, 'Team Fortress 2', 'Valve', 2007, 'Shooter de clases en equipo con estilo cartoon, 9 clases únicas con roles definidos y una economía de items cosméticos con millones de objetos. El pionero del shooter de héroes moderno.', 'https://cdn.akamai.steamstatic.com/steam/apps/440/header.jpg', 'https://www.youtube.com/results?search_query=Team+Fortress+2'),
(10, 'Warface', 'Crytek', 2013, 'Shooter militar táctico en primera persona con motor CryEngine. Operaciones cooperativas PvE y modos PvP competitivos. Uno de los shooters gratuitos más longevos del mercado.', 'https://cdn.akamai.steamstatic.com/steam/apps/291480/header.jpg', 'https://www.youtube.com/results?search_query=Warface'),
(11, 'Planetside 2', 'Rogue Planet Games', 2012, 'MMOFPS masivo con batallas continuas de miles de jugadores. Tres facciones luchan por el control de continentes en un conflicto sin fin. Escala de combate incomparable en ningún otro juego.', 'https://cdn.akamai.steamstatic.com/steam/apps/218230/header.jpg', 'https://www.youtube.com/results?search_query=Planetside+2'),
(12, 'Splitgate', '1047 Games', 2021, 'FPS arena con portales integrados en combate tipo Halo. Las aperturas de portal crean ángulos y situaciones imposibles. Gratis y con una comunidad competitiva activa en torneos.', 'https://cdn.akamai.steamstatic.com/steam/apps/677620/header.jpg', 'https://www.youtube.com/results?search_query=Splitgate'),
(13, 'Quake Champions', 'id Software', 2017, 'Arena shooter de alta velocidad heredero del Quake clásico con campeones de habilidades únicas y movimiento técnico de alta precisión. El arena shooter free-to-play definitivo.', 'https://cdn.akamai.steamstatic.com/steam/apps/611500/header.jpg', 'https://www.youtube.com/results?search_query=Quake+Champions'),
(14, 'Enlisted', 'Darkflow Software', 2021, 'Shooter de escuadrones de la Segunda Guerra Mundial con soldados IA bajo tu mando en batallas históricas masivas. Vehículos auténticos, armas de época y mapas basados en operaciones reales.', 'https://cdn.akamai.steamstatic.com/steam/apps/1277400/header.jpg', 'https://www.youtube.com/results?search_query=Enlisted'),
(15, 'Battlebit Remastered', 'SgtOkiDoki', 2023, 'FPS masivo indie para 254 jugadores con edificios 100% destructibles, clases bien diferenciadas y una profundidad táctica que supera a muchos triple-A con una fracción del presupuesto.', 'https://cdn.akamai.steamstatic.com/steam/apps/671860/header.jpg', 'https://www.youtube.com/results?search_query=Battlebit+Remastered'),
(16, 'Rogue Company', 'First Watch Games', 2020, 'Shooter táctico de agentes con eliminación por rondas, habilidades únicas por personaje y estética cinematográfica estilizada. Alternativa sólida al Valorant con su propio encanto.', 'https://cdn.akamai.steamstatic.com/steam/apps/872120/header.jpg', 'https://www.youtube.com/results?search_query=Rogue+Company'),
(17, 'APB Reloaded', 'Reloaded Productions', 2012, 'MMO de mundo abierto urbano donde criminalistas y fuerzas del orden compiten. Personalización extrema de personajes, vehículos y música dinámica adaptada a cada jugador.', 'https://cdn.akamai.steamstatic.com/steam/apps/113400/header.jpg', 'https://www.youtube.com/results?search_query=APB+Reloaded'),
(18, 'Doom Eternal', 'id Software', 2020, 'El mejor shooter en primera persona de acción vertiginosa. El Doom Slayer regresa con movimiento imposible, armas devastadoras y una dirección artística demoniaca incomparable.', 'https://cdn.akamai.steamstatic.com/steam/apps/782330/header.jpg', 'https://www.youtube.com/results?search_query=Doom+Eternal'),
(19, 'Doom (2016)', 'id Software', 2016, 'El renacimiento del shooter de id Software. Combate rápido y brutal contra demonios infernales en Marte con un ritmo frenético, diseño de niveles vertical y una banda sonora de metal brutal.', 'https://cdn.akamai.steamstatic.com/steam/apps/379720/header.jpg', 'https://www.youtube.com/results?search_query=Doom+(2016)'),
(20, 'Wolfenstein II: The New Colossus', 'MachineGames', 2017, 'Shooter narrativo de acción en una América alternativa conquistada por nazis. Historia apasionante con crítica social sin filtros, armas duales y la mejor protagonista del género.', 'https://cdn.akamai.steamstatic.com/steam/apps/612880/header.jpg', 'https://www.youtube.com/results?search_query=Wolfenstein+II:+The+New+Colossus'),
(21, 'Deathloop', 'Arkane Studios', 2021, 'Shooter de loop temporal donde debes eliminar ocho objetivos antes del amanecer. Cada iteración revela nuevos caminos, secretos e interacciones entre los blancos de Blackreef.', 'https://cdn.akamai.steamstatic.com/steam/apps/1252330/header.jpg', 'https://www.youtube.com/results?search_query=Deathloop'),
(22, 'Left 4 Dead 2', 'Valve', 2009, 'El cooperativo de zombis definitivo. Cuatro supervivientes deben atravesar hordas de infectados. AI Director dinámico que adapta la dificultad en tiempo real para mantener la tensión.', 'https://cdn.akamai.steamstatic.com/steam/apps/550/header.jpg', 'https://www.youtube.com/results?search_query=Left+4+Dead+2'),
(23, 'Portal 2', 'Valve', 2011, 'La secuela del juego de puzles con portales más aclamada de la historia. Historia brillante con GLaDOS y Wheatley, puzles ingeniosos y un modo cooperativo para dos personas memorable.', 'https://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg', 'https://www.youtube.com/results?search_query=Portal+2'),
(24, 'Payday 2', 'Overkill Software', 2013, 'Shooter cooperativo de atracos bancarios. Hasta cuatro jugadores planifican y ejecutan robos de distintas dificultades. Cientos de builds de habilidades y un endgame con años de contenido.', 'https://cdn.akamai.steamstatic.com/steam/apps/218620/header.jpg', 'https://www.youtube.com/results?search_query=Payday+2'),
(25, 'Killing Floor 2', 'Tripwire Interactive', 2016, 'Shooter cooperativo de oleadas de mutantes con seis jugadores, diez clases únicas y desmembramiento gore espectacular. Los niveles de dificultad más exigentes del género cooperativo.', 'https://cdn.akamai.steamstatic.com/steam/apps/232090/header.jpg', 'https://www.youtube.com/results?search_query=Killing+Floor+2'),
(26, 'Back 4 Blood', 'Turtle Rock Studios', 2021, 'Cooperativo de supervivencia para cuatro jugadores con hordas de ratas skaven y guerreros del caos. Sistema de loot profundo y el mejor combate cuerpo a cuerpo del género cooperativo.', 'https://cdn.akamai.steamstatic.com/steam/apps/924970/header.jpg', 'https://www.youtube.com/results?search_query=Back+4+Blood'),
(27, 'Vermintide 2', 'Fatshark', 2018, 'El mejor juego de realidad virtual jamás creado. Ambientado en el universo Half-Life, redefine la inmersión en VR con puzles físicos, manipulación de objetos y una historia magistral.', 'https://cdn.akamai.steamstatic.com/steam/apps/552500/header.jpg', 'https://www.youtube.com/results?search_query=Vermintide+2'),
(28, 'Half-Life: Alyx', 'Valve', 2020, 'Cooperativo de hasta 4 enanos mineros contra insectos alienígenas en cuevas procedurales. El mejor juego indie del género con una comunidad legendaria y cero microtransacciones abusivas.', 'https://cdn.akamai.steamstatic.com/steam/apps/546560/header.jpg', 'https://www.youtube.com/results?search_query=Half-Life:+Alyx'),
(29, 'Deep Rock Galactic', 'Ghost Ship Games', 2020, 'Shooter de extracción PvPvE en el sur gótico de los Estados Unidos. Cazas monstruos para obtener recompensas mientras otros cazadores intentan robarte la victoria. Tensión pura.', 'https://cdn.akamai.steamstatic.com/steam/apps/548430/header.jpg', 'https://www.youtube.com/results?search_query=Deep+Rock+Galactic'),
(30, 'Hunt: Showdown 1896', 'Crytek', 2019, 'Shooter táctico de asedio 5v5 con operadores únicos, destrucción de entornos y profundidad estratégica incomparable. Cada ronda enseña algo nuevo después de miles de horas de juego.', 'https://cdn.akamai.steamstatic.com/steam/apps/594650/header.jpg', 'https://www.youtube.com/results?search_query=Hunt:+Showdown+1896'),
(31, 'Rainbow Six Siege', 'Ubisoft Montreal', 2015, 'Combate cuerpo a cuerpo multijugador con guerreros medievales, samurái y vikingos. Sistema de guardia direccional único que requiere leer al oponente con habilidad y precisión real.', 'https://cdn.akamai.steamstatic.com/steam/apps/359550/header.jpg', 'https://www.youtube.com/results?search_query=Rainbow+Six+Siege'),
(32, 'For Honor', 'Ubisoft Montreal', 2017, 'Parkour y supervivencia en una ciudad post-apocalíptica llena de zombis. Mundo abierto gigante, sistema de decisiones que altera la narrativa y cooperativo fluido para cuatro jugadores.', 'https://cdn.akamai.steamstatic.com/steam/apps/304390/header.jpg', 'https://www.youtube.com/results?search_query=For+Honor'),
(33, 'Dying Light 2: Stay Human', 'Techland', 2022, 'El battle royale más jugado del mundo con construcción de estructuras, eventos en vivo de cultura pop y crossovers masivos. Solo disponible en Epic Games Launcher, no en Steam.', 'https://cdn.akamai.steamstatic.com/steam/apps/534380/header.jpg', 'https://www.youtube.com/results?search_query=Dying+Light+2:+Stay+Human'),
(34, 'Borderlands 3', 'Gearbox Software', 2020, 'Looter-shooter cooperativo con mil millones de armas generadas por procedimiento. Cuatro Cazadores de la Cripta en seis planetas con el mejor gunplay de la saga Borderlands.', 'https://cdn.akamai.steamstatic.com/steam/apps/397540/header.jpg', 'https://www.youtube.com/results?search_query=Borderlands+3'),
(35, 'Outriders', 'People Can Fly', 2021, 'Shooter cooperativo de ciencia ficción con clases de habilidades únicas tan importantes como las armas. Cuatro estilos de combate radicalmente diferentes en un mundo postapocalíptico.', 'https://cdn.akamai.steamstatic.com/steam/apps/680420/header.jpg', 'https://www.youtube.com/results?search_query=Outriders'),
(36, 'BioShock Remastered', 'Irrational Games', 2016, 'Rapture, la ciudad submarina art-deco de los años 50 en colapso moral. Plasmidos, Big Daddies y el giro narrativo más icónico de la historia del videojuego. Remasterizado y gratuito en PC.', 'https://cdn.akamai.steamstatic.com/steam/apps/409710/header.jpg', 'https://www.youtube.com/results?search_query=BioShock+Remastered'),
(37, 'Metro Exodus', '4A Games', 2019, 'Artyom abandona el metro de Moscú en tren hacia el este de Rusia post-nuclear. El mejor Metro hasta la fecha con mundo semiabierto, ciclo de día y noche y supervivencia con recursos.', 'https://cdn.akamai.steamstatic.com/steam/apps/412020/header.jpg', 'https://www.youtube.com/results?search_query=Metro+Exodus'),
(38, 'Elden Ring', 'FromSoftware', 2022, 'La obra maestra de FromSoftware diseñada con George R.R. Martin. Combate exigente en mundo abierto, exploración libre de Las Tierras Intermedias y narrativa críptica incomparable.', 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg', 'https://www.youtube.com/results?search_query=Elden+Ring'),
(39, 'Dark Souls III', 'FromSoftware', 2016, 'El capítulo final de la trilogía Dark Souls. Combate rápido y preciso, diseño de niveles interconectado y una atmósfera de fin de los tiempos que marca un antes y después en el género.', 'https://cdn.akamai.steamstatic.com/steam/apps/374320/header.jpg', 'https://www.youtube.com/results?search_query=Dark+Souls+III'),
(40, 'Dark Souls Remastered', 'FromSoftware', 2018, 'El inicio de la leyenda soulslike remasterizado en HD. Lordran es el diseño de nivel más interconectado de la historia del videojuego. Morir aprendiendo hasta dominar cada jefe.', 'https://cdn.akamai.steamstatic.com/steam/apps/570940/header.jpg', 'https://www.youtube.com/results?search_query=Dark+Souls+Remastered'),
(41, 'Sekiro: Shadows Die Twice', 'FromSoftware', 2019, 'Acción samurái de FromSoftware con sistema de combate basado en postura, prótesis ninja con gadgets y narrativa sobre la resurrección en el Japón feudal. Exige perfección.', 'https://cdn.akamai.steamstatic.com/steam/apps/814380/header.jpg', 'https://www.youtube.com/results?search_query=Sekiro:+Shadows+Die+Twice'),
(42, 'Armored Core VI', 'FromSoftware', 2023, 'El regreso de la saga de mechas de FromSoftware. Personalización extrema de robots de combate, combate aéreo tridimensional frenético y jefes colosales que solo FromSoftware sabe diseñar.', 'https://cdn.akamai.steamstatic.com/steam/apps/1888160/header.jpg', 'https://www.youtube.com/results?search_query=Armored+Core+VI'),
(43, 'Lies of P', 'Round8 Studio', 2023, 'Soulslike ambientado en una Gepetto distorsionada y oscura con Pinocho como protagonista. Sistema de parada entre los mejores del género y una estética steampunk de marionetas únicas.', 'https://cdn.akamai.steamstatic.com/steam/apps/1627720/header.jpg', 'https://www.youtube.com/results?search_query=Lies+of+P'),
(44, 'Wo Long: Fallen Dynasty', 'Team Ninja', 2023, 'Soulslike de acción en la China de los Tres Reinos con sistema de espíritu, magia demoníaca y un combate basado en la deflexión perfecta. El team ninja en su mejor momento.', 'https://cdn.akamai.steamstatic.com/steam/apps/1627540/header.jpg', 'https://www.youtube.com/results?search_query=Wo+Long:+Fallen+Dynasty'),
(45, 'Nioh 2', 'Team Ninja', 2021, 'Soulslike en el Japón del Sengoku con sistema de Ki profundo, habilidades demoníacas yokai, cientos de armas únicas y uno de los sistemas de loot más complejos del género.', 'https://cdn.akamai.steamstatic.com/steam/apps/1325200/header.jpg', 'https://www.youtube.com/results?search_query=Nioh+2'),
(46, 'God of War', 'Santa Monica Studio', 2022, 'Kratos y su hijo Atreus emprenden un viaje épico por la mitología nórdica. Combate visceral, historia emotiva de padre e hijo y uno de los mejores juegos jamás creados por el ser humano.', 'https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg', 'https://www.youtube.com/results?search_query=God+of+War'),
(47, 'God of War: Ragnarök', 'Santa Monica Studio', 2024, 'La conclusión del arco nórdico de Kratos enfrenta a los dioses en el Ragnarök profetizado. Más mundos, más personajes y los momentos más épicos de toda la historia de God of War.', 'https://cdn.akamai.steamstatic.com/steam/apps/2322010/header.jpg', 'https://www.youtube.com/results?search_query=God+of+War:+Ragnarök'),
(48, 'Ghost of Tsushima', 'Sucker Punch', 2024, 'Jin Sakai defiende la isla de Tsushima adoptando las artes del deshonor contra la invasión mongola. Mundo abierto hermosísimo, katana satisfactoria y modo fotográfico legendario.', 'https://cdn.akamai.steamstatic.com/steam/apps/2215430/header.jpg', 'https://www.youtube.com/results?search_query=Ghost+of+Tsushima'),
(49, 'Cyberpunk 2077', 'CD Projekt Red', 2020, 'RPG de mundo abierto en Night City, una metrópolis cyberpunk brutal con historia narrada desde el cuerpo de V. La expansión Phantom Liberty convierte a este en uno de los grandes.', 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg', 'https://www.youtube.com/results?search_query=Cyberpunk+2077'),
(50, 'The Witcher 3: Wild Hunt', 'CD Projekt Red', 2015, 'El GOAT de los RPG de mundo abierto. Geralt busca a Ciri en un mundo de fantasía oscura con quests secundarias tan memorables como la historia principal. Más de 100 horas garantizadas.', 'https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg', 'https://www.youtube.com/results?search_query=The+Witcher+3:+Wild+Hunt'),
(51, 'Hogwarts Legacy', 'Avalanche Software', 2023, 'Vive la fantasía definitiva de asistir a Hogwarts en el siglo XIX. Aprende hechizos, monta hipogrifos y descubre un misterio antiguo que amenaza el mundo mágico con magia prohibida.', 'https://cdn.akamai.steamstatic.com/steam/apps/990080/header.jpg', 'https://www.youtube.com/results?search_query=Hogwarts+Legacy'),
(52, 'Horizon Zero Dawn', 'Guerrilla Games', 2020, 'Aloy caza máquinas en un futuro postapocalíptico cubierto de jungla. Narrativa de ciencia ficción fascinante, arco y sigilo satisfactorios y uno de los mejores mundos abiertos creados.', 'https://cdn.akamai.steamstatic.com/steam/apps/1151640/header.jpg', 'https://www.youtube.com/results?search_query=Horizon+Zero+Dawn'),
(53, 'Control', 'Remedy Entertainment', 2020, 'Jesse Faden toma el mando de una agencia federal paranormal. Arquitectura brutalista imposible que desafía la física, poderes telequinéticos y una narrativa surreal del universo Remedy.', 'https://cdn.akamai.steamstatic.com/steam/apps/870780/header.jpg', 'https://www.youtube.com/results?search_query=Control'),
(54, 'Alan Wake 2', 'Remedy Entertainment', 2023, 'Alan Wake 2 es una obra de arte del survival horror. Dos narradores, mundos que se superponen en tiempo real y la ruptura de la cuarta pared llevada a extremos cinematográficos únicos.', 'https://cdn.akamai.steamstatic.com/steam/apps/1874900/header.jpg', 'https://www.youtube.com/results?search_query=Alan+Wake+2'),
(55, 'A Plague Tale: Requiem', 'Asobo Studio', 2022, 'Amicia y Hugo huyen por el sur de Francia medieval mientras la enfermedad de Hugo desata plagas de ratas. Más grande, hermoso y devastador emocionalmente que el primero.', 'https://cdn.akamai.steamstatic.com/steam/apps/1885690/header.jpg', 'https://www.youtube.com/results?search_query=A+Plague+Tale:+Requiem'),
(56, 'A Plague Tale: Innocence', 'Asobo Studio', 2019, 'Una hermana y su hermano pequeño huyen de la Inquisición en Francia del siglo XIV. Narración emotiva de los hermanos de Rune con las ratas como mecánica central de supervivencia.', 'https://cdn.akamai.steamstatic.com/steam/apps/752590/header.jpg', 'https://www.youtube.com/results?search_query=A+Plague+Tale:+Innocence'),
(57, 'Marvel Spider-Man Remastered', 'Insomniac Games', 2022, 'El mejor juego de Spider-Man jamás creado. Traversal por Manhattan increíblemente satisfactorio, historia emotiva de Peter Parker y un sistema de combate espectacular y fluido.', 'https://cdn.akamai.steamstatic.com/steam/apps/1817070/header.jpg', 'https://www.youtube.com/results?search_query=Marvel+Spider-Man+Remastered'),
(58, 'Marvel Spider-Man Miles Morales', 'Insomniac Games', 2022, 'Miles Morales protege Harlem en invierno con nuevos poderes de venom y camuflaje. Historia más corta pero igual de emotiva y visualmente espectacular que la original de Peter Parker.', 'https://cdn.akamai.steamstatic.com/steam/apps/1928980/header.jpg', 'https://www.youtube.com/results?search_query=Marvel+Spider-Man+Miles+Morales'),
(59, 'Detroit: Become Human', 'Quantic Dream', 2019, 'Drama interactivo sobre androides que despiertan a la consciencia en Detroit del futuro. Cada decisión puede costar la vida de personajes en una narrativa que se bifurca constantemente.', 'https://cdn.akamai.steamstatic.com/steam/apps/1222140/header.jpg', 'https://www.youtube.com/results?search_query=Detroit:+Become+Human'),
(60, 'Death Stranding', 'Kojima Productions', 2020, 'Hideo Kojima redefine el concepto de juego social. Sam Porter entrega paquetes en un Estados Unidos desconectado mientras construye infraestructura que otros jugadores realmente utilizan.', 'https://cdn.akamai.steamstatic.com/steam/apps/1190460/header.jpg', 'https://www.youtube.com/results?search_query=Death+Stranding'),
(61, 'Returnal', 'Housemarque', 2023, 'Roguelite de ciencia ficción donde Selene queda atrapada en un loop temporal en un planeta alienígena. Bullet hell de nivel experto con una narrativa de terror psicológico profundo.', 'https://cdn.akamai.steamstatic.com/steam/apps/1649240/header.jpg', 'https://www.youtube.com/results?search_query=Returnal'),
(62, 'Ghostwire: Tokyo', 'Tango Gameworks', 2022, 'Un Tokio vaciado de personas pero lleno de espíritus malignos de folclore japonés. Combate con magia elemental, exploración cultural profunda y una estética nocturna hipnótica.', 'https://cdn.akamai.steamstatic.com/steam/apps/1475810/header.jpg', 'https://www.youtube.com/results?search_query=Ghostwire:+Tokyo'),
(63, 'Prey (2017)', 'Arkane Studios', 2017, 'Immersive sim de ciencia ficción en una estación espacial infestada de Typhons. Libertad absoluta para resolver situaciones con poderes alienígenas, física del entorno y creatividad pura.', 'https://cdn.akamai.steamstatic.com/steam/apps/480490/header.jpg', 'https://www.youtube.com/results?search_query=Prey+(2017)'),
(64, 'Dishonored 2', 'Arkane Studios', 2016, 'Immersive sim de sigilo con poderes sobrenaturales en una ciudad steampunk. Dos protagonistas con habilidades distintas y niveles diseñados como puzles 3D que admiten soluciones únicas.', 'https://cdn.akamai.steamstatic.com/steam/apps/403640/header.jpg', 'https://www.youtube.com/results?search_query=Dishonored+2'),
(65, 'Mass Effect: Legendary Edition', 'BioWare', 2021, 'La trilogía completa de Mass Effect remasterizada. La saga de ciencia ficción con el mejor ensemble de personajes del videojuego y decisiones que viajan entre los tres títulos.', 'https://cdn.akamai.steamstatic.com/steam/apps/1328670/header.jpg', 'https://www.youtube.com/results?search_query=Mass+Effect:+Legendary+Edition'),
(66, 'Star Wars Jedi: Fallen Order', 'Respawn Entertainment', 2019, 'Cal Kestis sobrevive al Orden 66 y busca restaurar la Orden Jedi. Plataformas y combate de sable inspirados en Souls con una historia que expande genuinamente el universo Star Wars.', 'https://cdn.akamai.steamstatic.com/steam/apps/1172380/header.jpg', 'https://www.youtube.com/results?search_query=Star+Wars+Jedi:+Fallen+Order'),
(67, 'Star Wars Jedi: Survivor', 'Respawn Entertainment', 2023, 'Cal Kestis cinco años después, más fuerte. Más estilos de combate, habilidades de Fuerza, zonas para explorar y un mundo semiabierto con secretos bien escondidos que recompensan.', 'https://cdn.akamai.steamstatic.com/steam/apps/1765590/header.jpg', 'https://www.youtube.com/results?search_query=Star+Wars+Jedi:+Survivor'),
(68, 'Monster Hunter: World', 'Capcom', 2018, 'El ecosistema vivo de Monster Hunter llega al mundo abierto. Criaturas colosales con comportamiento natural. Caza, craftea su equipamiento y regresa más fuerte a dominarlo de nuevo.', 'https://cdn.akamai.steamstatic.com/steam/apps/582010/header.jpg', 'https://www.youtube.com/results?search_query=Monster+Hunter:+World'),
(69, 'Monster Hunter Rise', 'Capcom', 2022, 'La versión más ágil de Monster Hunter con el Insecto Vergajo para moverse en el aire, el Palamute montable y el sistema Silkbind. Cooperativo perfecto para cuatro jugadores.', 'https://cdn.akamai.steamstatic.com/steam/apps/1446780/header.jpg', 'https://www.youtube.com/results?search_query=Monster+Hunter+Rise'),
(70, 'Warframe', 'Digital Extremes', 2013, 'Acción cooperativa en tercera persona donde controlas guerreros biomecánicos en misiones espaciales. Uno de los mejores free-to-play del mercado con cientos de horas de contenido.', 'https://cdn.akamai.steamstatic.com/steam/apps/230410/header.jpg', 'https://www.youtube.com/results?search_query=Warframe'),
(71, 'Path of Exile', 'Grinding Gear Games', 2013, 'ARPG oscuro con un árbol de habilidades de más de 1000 nodos, ligas temporadas con mecánicas únicas y economía basada en trueque de items. El ARPG definitivo para los amantes del género.', 'https://cdn.akamai.steamstatic.com/steam/apps/238960/header.jpg', 'https://www.youtube.com/results?search_query=Path+of+Exile'),
(72, 'Path of Exile 2', 'Grinding Gear Games', 2024, 'La secuela de Path of Exile con sistema de habilidades de gemas renovado, seis clases con ascendencias únicas y una campaña completamente rediseñada desde cero en acceso anticipado.', 'https://cdn.akamai.steamstatic.com/steam/apps/2694490/header.jpg', 'https://www.youtube.com/results?search_query=Path+of+Exile+2'),
(73, 'Last Epoch', 'Eleventh Hour Games', 2024, 'ARPG de viaje en el tiempo con árbol de habilidades masivo, sistema de crafting determinístico sin azar y múltiples eras temporales que visitar. El competidor más serio a Path of Exile.', 'https://cdn.akamai.steamstatic.com/steam/apps/899770/header.jpg', 'https://www.youtube.com/results?search_query=Last+Epoch'),
(74, 'Dauntless', 'Phoenix Labs', 2019, 'Caza cooperativa de monstruos gratuita inspirada en Monster Hunter con crafting de equipamiento a partir de los behemoths caídos y builds personalizables para cada cazador.', 'https://cdn.akamai.steamstatic.com/steam/apps/1235510/header.jpg', 'https://www.youtube.com/results?search_query=Dauntless'),
(75, 'Tower of Fantasy', 'Hotta Studio', 2022, 'MMORPG open world sci-fi con armas cambiables en pleno combate, exploración libre con glider y doble salto, y personajes gacha con mecánica de cambio entre ellos instantáneo.', 'https://cdn.akamai.steamstatic.com/steam/apps/2016590/header.jpg', 'https://www.youtube.com/results?search_query=Tower+of+Fantasy'),
(76, 'Torchlight Infinite', 'XD Entertainment', 2022, 'ARPG de la saga Torchlight con sistema de builds muy profundo, ligas de temporada, personajes únicos con habilidades propias y un mundo de fantasy oscuro bien construido.', 'https://cdn.akamai.steamstatic.com/steam/apps/1782000/header.jpg', 'https://www.youtube.com/results?search_query=Torchlight+Infinite'),
(77, 'Starfield', 'Bethesda', 2023, 'El primer RPG original de Bethesda en 25 años. Exploración de más de mil planetas generados, personalización extrema de personaje y nave, y la narrativa de las estrellas en Settled Systems.', 'https://cdn.akamai.steamstatic.com/steam/apps/1716740/header.jpg', 'https://www.youtube.com/results?search_query=Starfield'),
(78, 'Persona 5 Royal', 'Atlus', 2022, 'Los Phantom Thieves roban los corazones corrompidos de adultos abusivos en un Tokio moderno. El JRPG más estiloso jamás hecho con música, diseño visual y narrativa de nivel de obra maestra.', 'https://cdn.akamai.steamstatic.com/steam/apps/1687950/header.jpg', 'https://www.youtube.com/results?search_query=Persona+5+Royal'),
(79, 'Persona 4 Golden', 'Atlus', 2020, 'Un año en el pueblo de Inaba investigando asesinatos dentro de un mundo televisivo. JRPG de culto con historia de amistad, identidad y crecimiento personal absolutamente emotiva.', 'https://cdn.akamai.steamstatic.com/steam/apps/1113000/header.jpg', 'https://www.youtube.com/results?search_query=Persona+4+Golden'),
(80, 'Like a Dragon: Infinite Wealth', 'Ryu Ga Gotoku Studio', 2024, 'Ichiban Kasuga viaja a Hawái buscando a su madre mientras Kiryu enfrenta su mortalidad. El RPG más ambicioso de la saga con sistema por turnos evolucionado y la mejor historia de la franquicia.', 'https://cdn.akamai.steamstatic.com/steam/apps/2291640/header.jpg', 'https://www.youtube.com/results?search_query=Like+a+Dragon:+Infinite+Wealth'),
(81, 'Yakuza: Like a Dragon', 'Ryu Ga Gotoku Studio', 2020, 'El inicio de la era Ichiban Kasuga en Yakuza. RPG por turnos con mecánicas de trabajos, equipo de compañeros y una historia de amistad y traición en el Yokohama underground.', 'https://cdn.akamai.steamstatic.com/steam/apps/1235140/header.jpg', 'https://www.youtube.com/results?search_query=Yakuza:+Like+a+Dragon'),
(82, 'Baldurs Gate 3', 'Larian Studios', 2023, 'El RPG de la década basado en D&D 5ª edición. Libertad narrativa absoluta, combate táctico por turnos y una historia que responde a prácticamente cualquier decisión imaginable.', 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg', 'https://www.youtube.com/results?search_query=Baldurs+Gate+3'),
(83, 'Divinity: Original Sin 2', 'Larian Studios', 2017, 'RPG táctico cooperativo para cuatro jugadores. Sistema elemental profundo donde agua, fuego, veneno e incluso el tiempo interactúan para crear combates únicos e irrepetibles.', 'https://cdn.akamai.steamstatic.com/steam/apps/435150/header.jpg', 'https://www.youtube.com/results?search_query=Divinity:+Original+Sin+2'),
(84, 'Disco Elysium', 'ZA/UM', 2019, 'RPG narrativo sin combate donde un detective amnésico con habilidades que hablan investiga un asesinato. La escritura más brillante y original de toda la historia del videojuego.', 'https://cdn.akamai.steamstatic.com/steam/apps/632470/header.jpg', 'https://www.youtube.com/results?search_query=Disco+Elysium'),
(85, 'Undertale', 'Toby Fox', 2015, 'RPG donde no tienes que matar a nadie. Cada monstruo tiene personalidad e historia. Cuarta pared rota, banda sonora memorable e impacto cultural enorme. Un clásico indie moderno.', 'https://cdn.akamai.steamstatic.com/steam/apps/391540/header.jpg', 'https://www.youtube.com/results?search_query=Undertale'),
(86, 'Omori', 'Omocat', 2020, 'RPG de terror psicológico sobre la amistad, el duelo y la culpa. Mundos de sueño coloridos contrastan con una realidad oscura en una historia que te rompe el corazón completamente.', 'https://cdn.akamai.steamstatic.com/steam/apps/1150690/header.jpg', 'https://www.youtube.com/results?search_query=Omori'),
(87, 'Octopath Traveler II', 'Square Enix', 2023, 'JRPG 2D con estética HD que homenajea Chrono Trigger. Sistema de eclipse para ataques únicos, los mejores gráficos de pixel art de los últimos años y una aventura épica de luz y oscuridad.', 'https://cdn.akamai.steamstatic.com/steam/apps/2085580/header.jpg', 'https://www.youtube.com/results?search_query=Octopath+Traveler+II'),
(88, 'Triangle Strategy', 'Square Enix', 2022, 'Estrategia táctica HD-2D con decisiones políticas de peso real. Las votaciones de tus aliados determinan el rumbo de una guerra entre tres reinos por los recursos más valiosos del mundo.', 'https://cdn.akamai.steamstatic.com/steam/apps/1850510/header.jpg', 'https://www.youtube.com/results?search_query=Triangle+Strategy'),
(89, 'Sea of Stars', 'Sabotage Studio', 2023, 'Exploración espacial en un sistema solar atrapado en un loop de 22 minutos. Un misterio de arqueología cósmica que solo se puede resolver con curiosidad pura y observación sin guías.', 'https://cdn.akamai.steamstatic.com/steam/apps/1244090/header.jpg', 'https://www.youtube.com/results?search_query=Sea+of+Stars'),
(90, 'Outer Wilds', 'Mobius Digital', 2019, 'DLC de Outer Wilds que añade una estructura submarina oscura llena de secretos visuales, horror atmosférico genuino y un misterio completamente independiente del juego base.', 'https://cdn.akamai.steamstatic.com/steam/apps/753640/header.jpg', 'https://www.youtube.com/results?search_query=Outer+Wilds'),
(91, 'Outer Wilds: Echoes of the Eye', 'Mobius Digital', 2021, 'Roguelike del hijo de Hades que intenta escapar del inframundo con dioses olímpicos como personajes. Narrativa que avanza con cada intento fallido y el mejor loop de juego del género.', 'https://cdn.akamai.steamstatic.com/steam/apps/1662890/header.jpg', 'https://www.youtube.com/results?search_query=Outer+Wilds:+Echoes+of+the+Eye'),
(92, 'Hades', 'Supergiant Games', 2020, 'La secuela del mejor roguelike. Melinoe, hermana de Zagreus, enfrenta a Cronos. Más armas, dioses olímpicos, mecánicas renovadas y la misma narrativa adictiva que devora horas.', 'https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg', 'https://www.youtube.com/results?search_query=Hades'),
(93, 'Hades II', 'Supergiant Games', 2024, 'El roguelite más adictivo. Sobrevive oleadas de monstruos mientras tus armas evolucionan automáticamente en combinaciones devastadoras. Cientos de horas de contenido por un precio mínimo.', 'https://cdn.akamai.steamstatic.com/steam/apps/1628350/header.jpg', 'https://www.youtube.com/results?search_query=Hades+II'),
(94, 'Vampire Survivors', 'poncle', 2022, 'El creador del género de construcción de mazos roguelike. Cuatro personajes con mecánicas únicas, ascensión de veinte niveles de dificultad y miles de combinaciones de cartas únicas.', 'https://cdn.akamai.steamstatic.com/steam/apps/1794680/header.jpg', 'https://www.youtube.com/results?search_query=Vampire+Survivors'),
(95, 'Slay the Spire', 'MegaCrit', 2019, 'Roguelite de acción con plataformas fluidas y combate rápido y satisfactorio. Cada partida construye tu personaje diferente con celdas que permanecen entre intentos para progresar.', 'https://cdn.akamai.steamstatic.com/steam/apps/646570/header.jpg', 'https://www.youtube.com/results?search_query=Slay+the+Spire'),
(96, 'Dead Cells', 'Motion Twin', 2018, 'El roguelike definitivo de mazmorras. Más de 700 ítems, miles de sinergias descubribles, personajes secretos y una cantidad de contenido que ningún otro juego del género puede igualar.', 'https://cdn.akamai.steamstatic.com/steam/apps/588650/header.jpg', 'https://www.youtube.com/results?search_query=Dead+Cells'),
(97, 'The Binding of Isaac: Repentance', 'Nicalis', 2021, 'Bullet hell roguelike en una mazmorra con forma de pistola. Cientos de armas con personalidad propia, sinergia de objetos e items de referencia cultural y la diversidad más grande del género.', 'https://cdn.akamai.steamstatic.com/steam/apps/250900/header.jpg', 'https://www.youtube.com/results?search_query=The+Binding+of+Isaac:+Repentance'),
(98, 'Enter the Gungeon', 'Dodge Roll', 2016, 'Juego de cartas roguelike que no es lo que parece. Mezcla roguelike, escape room, horror y metaficción en una experiencia que sorprende y subvierte expectativas en cada hora de juego.', 'https://cdn.akamai.steamstatic.com/steam/apps/311690/header.jpg', 'https://www.youtube.com/results?search_query=Enter+the+Gungeon'),
(99, 'Inscryption', 'Daniel Mullins Games', 2021, 'Roguelike de construcción de mazos en un tren infernal que asciende al cielo. Defensa por pisos con cinco facciones combinables y profundidad estratégica que rivals Slay the Spire.', 'https://cdn.akamai.steamstatic.com/steam/apps/1092790/header.jpg', 'https://www.youtube.com/results?search_query=Inscryption'),
(100, 'Monster Train', 'Shiny Shoe', 2020, 'Roguelite donde cada píxel de cada sustancia simula física real. Agua, lava, ácido y veneno interactúan para crear situaciones que ningún desarrollador del mundo podría predecir.', 'https://cdn.akamai.steamstatic.com/steam/apps/1102190/header.jpg', 'https://www.youtube.com/results?search_query=Monster+Train'),
(101, 'Noita', 'Nolla Games', 2020, 'Roguelite de ciencia ficción donde Selene, astronauta de Astra, queda atrapada en loops mortales en Atropos. Bullet hell de nivel experto con horror psicológico profundo. Solo en PC.', 'https://cdn.akamai.steamstatic.com/steam/apps/881100/header.jpg', 'https://www.youtube.com/results?search_query=Noita'),
(102, 'Returnal', 'Housemarque', 2023, 'Survival gratuito con criaturas llamadas Pals que puedes capturar, hacer trabajar en tus fábricas y usar en combate. Fenómeno de principios de 2024 que superó todos los récords de Steam.', 'https://cdn.akamai.steamstatic.com/steam/apps/1649240/header.jpg', 'https://www.youtube.com/results?search_query=Returnal'),
(103, 'Palworld', 'Pocketpair', 2024, 'Cooperativo de Starship Troopers where cuatro soldados de la Super Tierra liberan galaxias de insectos y robots en misiones cambiantes según la guerra galática en tiempo real.', 'https://cdn.akamai.steamstatic.com/steam/apps/1623730/header.jpg', 'https://www.youtube.com/results?search_query=Palworld'),
(104, 'Helldivers 2', 'Arrowhead Studios', 2024, 'Supervivencia vikinga en el purgatorio nórdico generado proceduralmente. Construye asentamientos, caza bestias míticas, navega océanos y derrota a los jefes para honour Odin.', 'https://cdn.akamai.steamstatic.com/steam/apps/553850/header.jpg', 'https://www.youtube.com/results?search_query=Helldivers+2'),
(105, 'Valheim', 'Iron Gate', 2021, 'Supervivencia submarina en un planeta alienígena oceánico. Construye bases bajo el agua, explora biomas únicos generados a mano y descubre el misterio de la infección que plaga el planeta.', 'https://cdn.akamai.steamstatic.com/steam/apps/892970/header.jpg', 'https://www.youtube.com/results?search_query=Valheim'),
(106, 'Subnautica', 'Unknown Worlds', 2018, 'Supervivencia en el Yukón canadiense tras un desastre geomagnético. Sin zombis, sin enemigos sobrenaturales. Solo tú, el frío, el hambre, los lobos, el viento y el silencio.', 'https://cdn.akamai.steamstatic.com/steam/apps/264710/header.jpg', 'https://www.youtube.com/results?search_query=Subnautica'),
(107, 'The Long Dark', 'Hinterland', 2017, 'Supervivencia extrema en la selva amazónica. El psicólogo Jake Higgins debe sobrevivir contra enfermedades, insectos, jaguares, hambre y su propio deterioro psicológico progresivo.', 'https://cdn.akamai.steamstatic.com/steam/apps/305620/header.jpg', 'https://www.youtube.com/results?search_query=The+Long+Dark'),
(108, 'Green Hell', 'Creepy Jar', 2019, 'DLC de Outer Wilds centrado en una estructura submarina oscura con secretos visuales únicos y horror atmosférico sin combate. Una experiencia narrativa completamente diferente al base.', 'https://cdn.akamai.steamstatic.com/steam/apps/815370/header.jpg', 'https://www.youtube.com/results?search_query=Green+Hell'),
(110, 'Sons of The Forest', 'Endnight Games', 2023, 'Busca a un billonario en una isla llena de caníbales mutantes. El compañero IA Kelvin y Virginia son los mejores NPCs de supervivencia jamás creados. Secuela masiva de The Forest.', 'https://cdn.akamai.steamstatic.com/steam/apps/1326470/header.jpg', 'https://www.youtube.com/results?search_query=Sons+of+The+Forest'),
(111, 'Rust', 'Facepunch Studios', 2018, 'El survival multijugador más brutal. Apareces desnudo en un servidor con cientos de otros jugadores que querrán todo lo que tienes. Construye base, forja armas y sobrevive o muere.', 'https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg', 'https://www.youtube.com/results?search_query=Rust'),
(112, 'DayZ', 'Bohemia Interactive', 2018, 'El survival zombie más tenso. Cada jugador puede ser tu salvación o tu muerte. Gestión realista de recursos, enfermedades, heridas e hipotermia en Chernarus postapocalíptico.', 'https://cdn.akamai.steamstatic.com/steam/apps/221100/header.jpg', 'https://www.youtube.com/results?search_query=DayZ'),
(113, '7 Days to Die', 'The Fun Pimps', 2020, 'Survival crafting zombie con un giro mortal: cada siete días una horda ataca tu base con mayor intensidad. Construye, refuerza, arma trampas y prepárate para la oleada máxima.', 'https://cdn.akamai.steamstatic.com/steam/apps/251570/header.jpg', 'https://www.youtube.com/results?search_query=7+Days+to+Die'),
(114, 'ARK: Survival Ascended', 'Studio Wildcard', 2023, 'Versión remasterizada de ARK en Unreal Engine 5 con gráficos espectaculares. Doma dinosaurios, construye tribus y sobrevive en islas prehistóricas junto a criatura de todas las eras.', 'https://cdn.akamai.steamstatic.com/steam/apps/2399830/header.jpg', 'https://www.youtube.com/results?search_query=ARK:+Survival+Ascended'),
(115, 'Conan Exiles', 'Funcom', 2018, 'Survival en el mundo de Conan el Bárbaro. Construye desde chozas hasta castillos, invoca dioses gigantes para destruir bases enemigas y domina las brutales Tierras Exiladas.', 'https://cdn.akamai.steamstatic.com/steam/apps/440900/header.jpg', 'https://www.youtube.com/results?search_query=Conan+Exiles'),
(116, 'Dont Starve Together', 'Klei Entertainment', 2016, 'Supervivencia cooperativa en un mundo de pesadilla con estética Tim Burton. Gestiona cordura, hambre y frío mientras exploras biomas únicos llenos de secretos oscuros y criaturas peligrosas.', 'https://cdn.akamai.steamstatic.com/steam/apps/322330/header.jpg', 'https://www.youtube.com/results?search_query=Dont+Starve+Together'),
(117, 'The Forest', 'Endnight Games', 2018, 'Sobrevive en una isla llena de caníbales mutantes tras estrellarte en avión. Construye refugios, cultiva, caza y descubre los secretos de la isla en cooperativo o solitario inquietante.', 'https://cdn.akamai.steamstatic.com/steam/apps/242760/header.jpg', 'https://www.youtube.com/results?search_query=The+Forest'),
(118, 'Satisfactory', 'Coffee Stain Studios', 2024, 'Construcción de fábricas automatizadas en primera persona en un planeta alienígena. Conecta cintas, brazos y trenes para la cadena de producción más eficiente. No podrás parar.', 'https://cdn.akamai.steamstatic.com/steam/apps/526870/header.jpg', 'https://www.youtube.com/results?search_query=Satisfactory'),
(119, 'Factorio', 'Wube Software', 2020, 'El juego de automatización definitivo. Construye una fábrica desde cero en planeta hostil hasta lanzar un cohete al espacio mientras la fauna nativa te ataca y dificulta el progreso.', 'https://cdn.akamai.steamstatic.com/steam/apps/427520/header.jpg', 'https://www.youtube.com/results?search_query=Factorio'),
(120, 'RimWorld', 'Ludeon Studios', 2018, 'Simulador de colonia con narrador IA que genera historias únicas. Desastres, relaciones entre colonos, guerras y dilemas morales continuos. Cada partida es una historia diferente.', 'https://cdn.akamai.steamstatic.com/steam/apps/294100/header.jpg', 'https://www.youtube.com/results?search_query=RimWorld'),
(121, 'Stardew Valley', 'ConcernedApe', 2016, 'Farming sim en el valle de Pelican Town creado por una sola persona durante cuatro años. Cultiva, pesca, construye la granja perfecta y desarrolla relaciones profundas con los vecinos.', 'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg', 'https://www.youtube.com/results?search_query=Stardew+Valley'),
(122, 'Cities: Skylines', 'Colossal Order', 2015, 'El mejor simulador de ciudades. Gestiona tráfico, transporte público, zonas residenciales, agua y electricidad en ciudades que van de pueblos rurales a megalópolis de millones de habitantes.', 'https://cdn.akamai.steamstatic.com/steam/apps/255710/header.jpg', 'https://www.youtube.com/results?search_query=Cities:+Skylines'),
(123, 'Hollow Knight', 'Team Cherry', 2017, 'Metroidvania de insectos en un reino subterráneo en ruinas. Arte a mano bellísimo, combate exigente y preciso, y un mundo con lore profundo que descubres solo observando con atención.', 'https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg', 'https://www.youtube.com/results?search_query=Hollow+Knight'),
(124, 'Celeste', 'Maddy Makes Games', 2018, 'Plataformas de precisión sobre una joven que escala una montaña lidiando con su ansiedad. Historia emotiva sobre salud mental integrada en mecánicas de plataformas absolutamente perfectas.', 'https://cdn.akamai.steamstatic.com/steam/apps/504230/header.jpg', 'https://www.youtube.com/results?search_query=Celeste'),
(125, 'Cuphead', 'Studio MDHR', 2017, 'Juego de acción con estética de dibujos animados de los años 30 animados a mano. Cada uno de sus 19 jefes es una obra de arte visual con un patrón único y una dificultad exigente.', 'https://cdn.akamai.steamstatic.com/steam/apps/268910/header.jpg', 'https://www.youtube.com/results?search_query=Cuphead'),
(126, 'Ori and the Will of the Wisps', 'Moon Studios', 2020, 'Plataformas de precisión con la presentación visual más hermosa del género. Ori explora un bosque corrupto con combate evolucionado y una banda sonora orquestal devastadoramente bella.', 'https://cdn.akamai.steamstatic.com/steam/apps/1057090/header.jpg', 'https://www.youtube.com/results?search_query=Ori+and+the+Will+of+the+Wisps'),
(127, 'Pizza Tower', 'Tour De Pizza', 2023, 'Plataformas de velocidad frenética inspirado en Wario Land. Peppino va a destruir la torre pizza que amenaza su restaurante. El indie más enérgico y rápido de los últimos cinco años.', 'https://cdn.akamai.steamstatic.com/steam/apps/2231450/header.jpg', 'https://www.youtube.com/results?search_query=Pizza+Tower'),
(128, 'Bomb Rush Cyberfunk', 'Team Reptile', 2023, 'Sucesor espiritual de Jet Set Radio. Patina, grafiti y breakdance por Nueva Amsterdam con mecánicas de movimiento extraordinariamente fluidas y la banda sonora de Hideki Naganuma.', 'https://cdn.akamai.steamstatic.com/steam/apps/1353230/header.jpg', 'https://www.youtube.com/results?search_query=Bomb+Rush+Cyberfunk'),
(129, 'Terraria', 'Re-Logic', 2011, 'El sandbox 2D definitivo con cientos de horas de contenido. Más de 20 jefes, biomas únicos, cuatro modos de dificultad y un endgame que rivaliza con cualquier RPG del mercado.', 'https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg', 'https://www.youtube.com/results?search_query=Terraria'),
(130, 'Resident Evil Village', 'Capcom', 2021, 'Ethan Winters en un pueblo de Europa del Este gobernado por cuatro lords únicos. Lady Dimitrescu se convirtió en icono cultural. Horror en primera persona con acción intensa y visceral.', 'https://cdn.akamai.steamstatic.com/steam/apps/1196590/header.jpg', 'https://www.youtube.com/results?search_query=Resident+Evil+Village'),
(131, 'Resident Evil 4 Remake', 'Capcom', 2023, 'Remake del juego que reinventó los shooters en tercera persona. Leon Kennedy rescata a la hija del presidente en una aldea española infestada. El remake más completo de la historia del videojuego.', 'https://cdn.akamai.steamstatic.com/steam/apps/2050650/header.jpg', 'https://www.youtube.com/results?search_query=Resident+Evil+4+Remake'),
(132, 'Resident Evil 2 Remake', 'Capcom', 2019, 'Leon y Claire en una Raccoon City zombificada. El Señor X persiguiéndote implacable, recursos escasos y atmósfera de terror que revitalizó completamente el género del survival horror.', 'https://cdn.akamai.steamstatic.com/steam/apps/883710/header.jpg', 'https://www.youtube.com/results?search_query=Resident+Evil+2+Remake'),
(133, 'Dragons Dogma 2', 'Capcom', 2024, 'Acción en un mundo de fantasía en el que puedes contratar peones como compañeros de viaje y explorar un mundo enorme. La vocación del Arisen en el remake de Capcom para la nueva generación.', 'https://cdn.akamai.steamstatic.com/steam/apps/2054970/header.jpg', 'https://www.youtube.com/results?search_query=Dragons+Dogma+2'),
(134, 'Phasmophobia', 'Kinetic Games', 2020, 'Investigación de fantasmas cooperativa que usa tu micrófono de voz real para comunicarte con los espíritus. Con VR el terror es insoportable. Sin VR también aterroriza soberanamente.', 'https://cdn.akamai.steamstatic.com/steam/apps/739630/header.jpg', 'https://www.youtube.com/results?search_query=Phasmophobia'),
(135, 'Dead by Daylight', 'Behaviour Interactive', 2016, 'Asimétrico de horror 4v1 donde cuatro supervivientes escapan de un asesino. Licencias de Halloween, Freddy, Resident Evil, Silent Hill, Alien y docenas más de franquicias icónicas.', 'https://cdn.akamai.steamstatic.com/steam/apps/381210/header.jpg', 'https://www.youtube.com/results?search_query=Dead+by+Daylight'),
(136, 'Among Us', 'InnerSloth', 2018, 'El impostor entre la tripulación. Identifica al traidor antes de que elimine a todos. Fenómeno cultural global que conquistó el mundo durante el confinamiento de la pandemia de 2020.', 'https://cdn.akamai.steamstatic.com/steam/apps/945360/header.jpg', 'https://www.youtube.com/results?search_query=Among+Us'),
(137, 'Lethal Company', 'Zeekerss', 2023, 'Cuatro trabajadores recogen chatarra en lunas abandonadas para una corporación. Horror cooperativo donde los monstruos son completamente impredecibles y la atmósfera es genuinamente aterradora.', 'https://cdn.akamai.steamstatic.com/steam/apps/1966720/header.jpg', 'https://www.youtube.com/results?search_query=Lethal+Company'),
(138, 'Dave the Diver', 'MINTROCKET', 2023, 'Mergúzate de día para capturar ingredientes en un mar infinito y atiende tu restaurante de sushi de noche. Indie del año 2023 que mezcla géneros aparentemente opuestos de forma brillante.', 'https://cdn.akamai.steamstatic.com/steam/apps/1868140/header.jpg', 'https://www.youtube.com/results?search_query=Dave+the+Diver'),
(139, 'Street Fighter 6', 'Capcom', 2023, 'El mejor Street Fighter desde el legendario SF2. World Tour modo historia, Battle Hub y el sistema Drive que convierte cada guardia en una decisión táctica de alto riesgo y recompensa.', 'https://cdn.akamai.steamstatic.com/steam/apps/1364780/header.jpg', 'https://www.youtube.com/results?search_query=Street+Fighter+6'),
(140, 'Tekken 8', 'Bandai Namco', 2024, 'El capítulo final de Kazuya vs Jin con el sistema Heat que transforma el combate. Gráficos que muestran el estado del arte del género y el mejor modo historia de la franquicia.', 'https://cdn.akamai.steamstatic.com/steam/apps/1778820/header.jpg', 'https://www.youtube.com/results?search_query=Tekken+8'),
(141, 'Mortal Kombat 1', 'NetherRealm Studios', 2023, 'Reinicio del universo MK con Liu Kang como dios del tiempo. Sistema de Kameos que invoca personajes de apoyo, violencia extrema característica y la historia más ambiciosa de la franquicia.', 'https://cdn.akamai.steamstatic.com/steam/apps/1971870/header.jpg', 'https://www.youtube.com/results?search_query=Mortal+Kombat+1'),
(142, 'Brawlhalla', 'Blue Mammoth Games', 2017, 'Juego de lucha de plataformas free-to-play con leyendas únicas y crossovers masivos con múltiples franquicias. Torneos constantes y mecánicas accesibles con techo competitivo alto.', 'https://cdn.akamai.steamstatic.com/steam/apps/291640/header.jpg', 'https://www.youtube.com/results?search_query=Brawlhalla'),
(143, 'MultiVersus', 'Player First Games', 2022, 'Plataformas fighter free-to-play con personajes de Warner Bros. Batman, Wonder Woman, Shaggy, Tom & Jerry, Arya Stark y muchos más en combates cooperativos y competitivos.', 'https://cdn.akamai.steamstatic.com/steam/apps/1818750/header.jpg', 'https://www.youtube.com/results?search_query=MultiVersus'),
(144, 'Civilization VI', 'Firaxis Games', 2016, '4X de construcción de civilizaciones desde la prehistoria hasta el futuro. Siempre un turno más. El juego que más horas devora en el tiempo libre sin que el jugador lo note jamás.', 'https://cdn.akamai.steamstatic.com/steam/apps/289070/header.jpg', 'https://www.youtube.com/results?search_query=Civilization+VI'),
(145, 'NieR: Automata', 'PlatinumGames', 2017, 'El androide 2B y su compañero 9S defienden la Tierra de máquinas alienígenas en el futuro postapocalíptico. Acción hack and slash con filosofía existencialista y narrativa en múltiples capas.', 'https://cdn.akamai.steamstatic.com/steam/apps/524220/header.jpg', 'https://www.youtube.com/results?search_query=NieR:+Automata'),
(146, 'Total War: Warhammer III', 'Creative Assembly', 2022, 'El mayor Total War jamás creado. Campaña épica en el Caos, batallas con demonios, ogros y dragones en tiempo real y la conquista del Mundo de los Finales con todas las facciones.', 'https://cdn.akamai.steamstatic.com/steam/apps/1142710/header.jpg', 'https://www.youtube.com/results?search_query=Total+War:+Warhammer+III'),
(147, 'Age of Empires IV', 'Relic Entertainment', 2021, 'El regreso de la saga RTS más icónica. Ocho civilizaciones con mecánicas únicas en período medieval, documentales históricos integrados y el mejor equilibrio del género en años.', 'https://cdn.akamai.steamstatic.com/steam/apps/1466860/header.jpg', 'https://www.youtube.com/results?search_query=Age+of+Empires+IV'),
(148, 'Crusader Kings III', 'Paradox Development', 2020, 'Simulador de dinastías medievales donde la historia la escriben tus personajes únicos. Cada rey, duquesa y bastardo tiene atributos que definen guerras, alianzas y traiciones reales.', 'https://cdn.akamai.steamstatic.com/steam/apps/1158310/header.jpg', 'https://www.youtube.com/results?search_query=Crusader+Kings+III'),
(149, 'Europa Universalis IV', 'Paradox Development', 2013, 'El gran juego de historia alternativa. Controla cualquier nación entre 1444 y 1821 y reescribe el mapa mundial con diplomacia, guerra, comercio, colonización y exploración.', 'https://cdn.akamai.steamstatic.com/steam/apps/236850/header.jpg', 'https://www.youtube.com/results?search_query=Europa+Universalis+IV'),
(150, 'NieR Replicant ver.1.22', 'toylogic', 2021, 'Nier Replicant, predecesor de NieR: Automata remasterizado. La historia de un hermano que busca curar a su hermana de la enfermedad Negra en un mundo postapocalíptico de fantasía.', 'https://cdn.akamai.steamstatic.com/steam/apps/1382330/header.jpg', 'https://www.youtube.com/results?search_query=NieR+Replicant+ver.1.22'),
(151, 'Stellaris', 'Paradox Development', 2016, '4X espacial de Paradox con civilizaciones alienígenas generadas por procedimiento. Cada partida es una ciencia ficción distinta con crisis galácticas, anomalías y reliquias únicas.', 'https://cdn.akamai.steamstatic.com/steam/apps/281990/header.jpg', 'https://www.youtube.com/results?search_query=Stellaris'),
(152, 'Hearts of Iron IV', 'Paradox Development', 2016, 'Simulador de la Segunda Guerra Mundial a escala global. Controla cualquier nación, diseña equipamiento, crea doctrinas militares y reescribe el resultado de la guerra más grande.', 'https://cdn.akamai.steamstatic.com/steam/apps/394360/header.jpg', 'https://www.youtube.com/results?search_query=Hearts+of+Iron+IV'),
(153, 'Warhammer 40K: Space Marine 2', 'Saber Interactive', 2024, 'Cooperativo de hasta cuatro jugadores que defienden a la Humanidad de las Fuerzas del Caos en el universo Warhammer 40K. Combate cuerpo a cuerpo brutal con mecánicas de clase.', 'https://cdn.akamai.steamstatic.com/steam/apps/2183900/header.jpg', 'https://www.youtube.com/results?search_query=Warhammer+40K:+Space+Marine+2'),
(154, 'XCOM 2', 'Firaxis Games', 2016, 'Estrategia táctica por turnos donde la humanidad perdió. Dirige la resistencia con soldados que puedes nombrar y cuyos nombres llorarás cuando mueran en combate de forma permanente.', 'https://cdn.akamai.steamstatic.com/steam/apps/268500/header.jpg', 'https://www.youtube.com/results?search_query=XCOM+2'),
(155, 'Darkest Dungeon 2', 'Red Hook Studios', 2023, 'La secuela del roguelike de horror cósmico. Viaja en diligencia por un mundo agonizante con héroes quebrados por sus traumas, combate renovado y la misma crueldad despiadada del original.', 'https://cdn.akamai.steamstatic.com/steam/apps/1940340/header.jpg', 'https://www.youtube.com/results?search_query=Darkest+Dungeon+2'),
(156, 'Forza Horizon 5', 'Playground Games', 2021, 'El mejor juego de carreras en mundo abierto. México con más de 500 coches, eventos de todo tipo, físicas realistas y los mejores gráficos del género de conducción en mundo abierto.', 'https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg', 'https://www.youtube.com/results?search_query=Forza+Horizon+5'),
(157, 'Rocket League', 'Psyonix', 2020, 'Fútbol con coches propulsados por cohetes. Aprende a volar, hacer aéreos y demoler rivales en partidas de cinco minutos que llevan años dominar completamente. Free-to-play desde 2020.', 'https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg', 'https://www.youtube.com/results?search_query=Rocket+League'),
(158, 'Dirt Rally 2.0', 'Codemasters', 2019, 'El simulador de rally más exigente del mercado. Sin HUD es una experiencia pura en barro, nieve y grava donde un error puede arruinar kilómetros de carrera perfecta e implacable.', 'https://cdn.akamai.steamstatic.com/steam/apps/690790/header.jpg', 'https://www.youtube.com/results?search_query=Dirt+Rally+2.0'),
(159, 'Forza Motorsport (2023)', 'Turn 10 Studios', 2023, 'El simulador de conducción de Forza de nueva generación. Modelo de físicas único por coche, climatología dinámica y un sistema de progresión por evento que premia la habilidad real.', 'https://cdn.akamai.steamstatic.com/steam/apps/2440510/header.jpg', 'https://www.youtube.com/results?search_query=Forza+Motorsport+(2023)');

INSERT INTO platforms (name) VALUES 
('PC'), 
('PlayStation 5'), 
('Xbox Series X/S'), 
('Nintendo Switch'), 
('Mobile');

INSERT INTO genres (name) VALUES 
('RPG'), 
('Action'), 
('Adventure'), 
('Indie'), 
('Shooter'), 
('Strategy'), 
('Sports'), 
('Horror'), 
('Puzzle'), 
('Fighting');

-- Géneros adicionales requeridos por los nuevos juegos
INSERT INTO genres (id, name) VALUES
(11, 'Battle Royale'),
(12, 'Metroidvania'),
(13, 'Platformer'),
(14, 'Roguelike'),
(15, 'Simulation'),
(16, 'Survival'),
(18, 'Racing'),
(19, 'Sandbox'),
(20, 'Party');

INSERT INTO collections (title, description, image_url) VALUES 
-- Colecciones originales con imágenes reales
('GOTY Winners',         'Los ganadores del Juego del Año a lo largo de la historia.',          'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=600&h=400&fit=crop'),
('Indie Gems',           'Pequeños equipos, grandes experiencias. Lo mejor del indie.',          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop'),
('Para jugar con amigos','Multijugador divertido y caótico. Risas garantizadas.',                'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop'),
-- Nuevas colecciones
('Soulslike & Difíciles', 'Para los que disfrutan sufriendo. Muere, aprende, supera.',           'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop'),
('Mundo Abierto',         'Mundos inmensos que explorar sin límites ni prisas.',                 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'),
('Terror y Supervivencia','Juegos que te ponen los pelos de punta. No juegues solo de noche.',   'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&h=400&fit=crop'),
('Shooters Competitivos', 'Los mejores shooters para demostrar tu puntería online.',             'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop'),
('Narrativa y Historia',  'Juegos donde la historia lo es todo. Prepara los pañuelos.',          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop'),
('Roguelikes Adictivos',  'Una partida más. Siempre una más. No podrás parar.',                  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&h=400&fit=crop'),
('JRPGs y RPGs épicos',   'Aventuras de rol con cientos de horas de contenido.',                 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?w=600&h=400&fit=crop'),
('Free to Play',          'Lo mejor que puedes jugar sin gastar un euro.',                       'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop'),
('Cooperativo Imprescindible','Los mejores juegos para disfrutar en compañía.',                  'https://images.unsplash.com/photo-1511882150382-421056c89033?w=600&h=400&fit=crop'),
('Estrategia y Gestión',  'Pon a prueba tu cerebro. Planifica, conquista, domina.',              'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=600&h=400&fit=crop');

INSERT INTO game_platforms (game_id, platform_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 5),
(2, 1),
(2, 2),
(2, 3),
(2, 5),
(3, 1),
(3, 2),
(3, 3),
(3, 4),
(4, 1),
(4, 2),
(4, 3),
(5, 1),
(5, 2),
(5, 3),
(6, 1),
(6, 3),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1),
(14, 2),
(14, 3),
(15, 1),
(16, 1),
(17, 1),
(18, 1),
(18, 2),
(18, 3),
(18, 4),
(19, 1),
(19, 2),
(19, 3),
(19, 4),
(20, 1),
(20, 2),
(20, 3),
(20, 4),
(21, 1),
(21, 2),
(21, 3),
(22, 1),
(23, 1),
(24, 1),
(25, 1),
(25, 2),
(25, 3),
(26, 1),
(26, 2),
(26, 3),
(27, 1),
(28, 1),
(29, 1),
(29, 2),
(29, 3),
(30, 1),
(30, 2),
(30, 3),
(31, 1),
(31, 2),
(31, 3),
(32, 1),
(32, 2),
(32, 3),
(33, 1),
(33, 2),
(33, 3),
(34, 1),
(34, 2),
(34, 3),
(35, 1),
(35, 2),
(35, 3),
(36, 1),
(37, 1),
(38, 1),
(38, 2),
(38, 3),
(39, 1),
(39, 2),
(39, 3),
(40, 1),
(40, 2),
(40, 3),
(40, 4),
(41, 1),
(41, 2),
(41, 3),
(42, 1),
(42, 2),
(42, 3),
(43, 1),
(43, 2),
(43, 3),
(44, 1),
(44, 2),
(44, 3),
(45, 1),
(45, 2),
(46, 1),
(46, 2),
(47, 1),
(47, 2),
(48, 1),
(48, 2),
(49, 1),
(49, 2),
(49, 3),
(50, 1),
(50, 2),
(50, 3),
(50, 4),
(51, 1),
(51, 2),
(51, 3),
(51, 4),
(52, 1),
(52, 2),
(53, 1),
(53, 2),
(53, 3),
(54, 1),
(54, 2),
(54, 3),
(55, 1),
(55, 2),
(55, 3),
(55, 4),
(56, 1),
(56, 2),
(56, 3),
(56, 4),
(57, 1),
(57, 2),
(58, 1),
(58, 2),
(59, 1),
(59, 2),
(60, 1),
(60, 2),
(60, 3),
(61, 1),
(61, 2),
(62, 1),
(62, 2),
(62, 3),
(63, 1),
(63, 2),
(63, 3),
(64, 1),
(64, 2),
(64, 3),
(65, 1),
(65, 2),
(65, 3),
(66, 1),
(66, 2),
(66, 3),
(67, 1),
(67, 2),
(67, 3),
(68, 1),
(68, 2),
(68, 3),
(69, 1),
(69, 2),
(69, 3),
(69, 4),
(70, 1),
(70, 2),
(70, 3),
(70, 4),
(70, 5),
(71, 1),
(72, 1),
(73, 1),
(74, 1),
(74, 2),
(74, 3),
(74, 4),
(74, 5),
(75, 1),
(75, 5),
(76, 1),
(76, 5),
(77, 1),
(77, 3),
(78, 1),
(78, 2),
(78, 3),
(78, 4),
(79, 1),
(79, 2),
(79, 4),
(80, 1),
(80, 2),
(80, 3),
(81, 1),
(81, 2),
(81, 3),
(82, 1),
(82, 2),
(82, 3),
(83, 1),
(83, 2),
(83, 3),
(84, 1),
(85, 1),
(85, 4),
(86, 1),
(86, 4),
(87, 1),
(87, 2),
(87, 3),
(87, 4),
(88, 1),
(88, 4),
(89, 1),
(89, 2),
(89, 3),
(89, 4),
(90, 1),
(90, 2),
(90, 3),
(90, 4),
(91, 1),
(91, 2),
(91, 3),
(92, 1),
(92, 2),
(92, 3),
(92, 4),
(92, 5),
(93, 1),
(93, 2),
(93, 3),
(93, 4),
(94, 1),
(94, 2),
(94, 3),
(94, 4),
(94, 5),
(95, 1),
(95, 2),
(95, 3),
(95, 4),
(95, 5),
(96, 1),
(96, 2),
(96, 3),
(96, 4),
(96, 5),
(97, 1),
(97, 2),
(97, 3),
(97, 4),
(98, 1),
(98, 2),
(98, 3),
(98, 4),
(99, 1),
(99, 2),
(99, 3),
(100, 1),
(100, 2),
(100, 3),
(100, 4),
(101, 1),
(102, 1),
(102, 2),
(103, 1),
(103, 3),
(104, 1),
(104, 2),
(105, 1),
(105, 3),
(106, 1),
(106, 2),
(106, 3),
(107, 1),
(107, 2),
(107, 3),
(108, 1),
(108, 2),
(108, 3),
(110, 1),
(110, 3),
(111, 1),
(111, 2),
(111, 3),
(112, 1),
(112, 2),
(112, 3),
(113, 1),
(113, 2),
(113, 3),
(114, 1),
(114, 2),
(114, 3),
(115, 1),
(115, 2),
(115, 3),
(116, 1),
(116, 2),
(116, 3),
(116, 4),
(117, 1),
(117, 2),
(117, 3),
(118, 1),
(118, 3),
(119, 1),
(120, 1),
(121, 1),
(121, 2),
(121, 3),
(121, 4),
(121, 5),
(122, 1),
(122, 2),
(122, 3),
(122, 4),
(123, 1),
(123, 2),
(123, 3),
(123, 4),
(124, 1),
(124, 2),
(124, 3),
(124, 4),
(124, 5),
(125, 1),
(125, 2),
(125, 3),
(125, 4),
(126, 1),
(126, 2),
(126, 3),
(126, 4),
(127, 1),
(127, 4),
(128, 1),
(128, 2),
(128, 3),
(128, 4),
(129, 1),
(129, 2),
(129, 3),
(129, 4),
(129, 5),
(130, 1),
(130, 2),
(130, 3),
(130, 4),
(131, 1),
(131, 2),
(131, 3),
(131, 4),
(132, 1),
(132, 2),
(132, 3),
(132, 4),
(133, 1),
(133, 2),
(133, 3),
(134, 1),
(135, 1),
(135, 2),
(135, 3),
(135, 4),
(135, 5),
(136, 1),
(136, 2),
(136, 3),
(136, 4),
(136, 5),
(137, 1),
(138, 1),
(138, 2),
(138, 3),
(138, 4),
(139, 1),
(139, 2),
(139, 3),
(139, 4),
(140, 1),
(140, 2),
(140, 3),
(141, 1),
(141, 2),
(141, 3),
(141, 4),
(142, 1),
(142, 2),
(142, 3),
(142, 4),
(142, 5),
(143, 1),
(143, 2),
(143, 3),
(143, 4),
(144, 1),
(144, 2),
(144, 3),
(144, 4),
(144, 5),
(145, 1),
(145, 2),
(145, 3),
(146, 1),
(147, 1),
(147, 3),
(148, 1),
(149, 1),
(150, 1),
(150, 2),
(150, 3),
(151, 1),
(152, 1),
(153, 1),
(153, 2),
(153, 3),
(154, 1),
(154, 2),
(154, 3),
(154, 4),
(154, 5),
(155, 1),
(155, 2),
(155, 3),
(156, 1),
(156, 3),
(157, 1),
(157, 2),
(157, 3),
(157, 4),
(157, 5),
(158, 1),
(158, 2),
(158, 3),
(159, 1),
(159, 3);

INSERT INTO game_genres (game_id, genre_id) VALUES
(1, 5),
(1, 11),
(2, 5),
(2, 11),
(3, 5),
(3, 11),
(4, 5),
(4, 11),
(5, 5),
(5, 11),
(6, 5),
(7, 5),
(7, 11),
(8, 5),
(9, 5),
(10, 5),
(11, 5),
(12, 5),
(13, 5),
(14, 5),
(15, 5),
(16, 5),
(17, 5),
(18, 5),
(19, 5),
(20, 5),
(21, 5),
(22, 5),
(23, 9),
(23, 5),
(24, 5),
(25, 5),
(26, 5),
(27, 5),
(28, 5),
(29, 5),
(30, 5),
(31, 5),
(32, 5),
(33, 5),
(34, 5),
(35, 5),
(36, 5),
(37, 5),
(38, 1),
(38, 2),
(39, 1),
(39, 2),
(40, 1),
(40, 2),
(41, 1),
(41, 2),
(42, 1),
(42, 2),
(43, 1),
(43, 2),
(44, 1),
(44, 2),
(45, 1),
(45, 2),
(46, 1),
(46, 2),
(47, 1),
(47, 2),
(48, 1),
(48, 2),
(49, 1),
(49, 2),
(50, 1),
(50, 2),
(51, 1),
(51, 2),
(52, 1),
(52, 2),
(53, 1),
(53, 2),
(54, 1),
(54, 2),
(55, 1),
(55, 2),
(56, 1),
(56, 2),
(57, 1),
(57, 2),
(58, 1),
(58, 2),
(59, 3),
(60, 1),
(60, 2),
(61, 1),
(61, 2),
(62, 1),
(62, 2),
(63, 1),
(63, 2),
(64, 1),
(64, 2),
(65, 1),
(65, 2),
(66, 1),
(66, 2),
(67, 1),
(67, 2),
(68, 1),
(68, 2),
(69, 1),
(69, 2),
(70, 1),
(70, 2),
(71, 1),
(71, 2),
(72, 1),
(72, 2),
(73, 1),
(73, 2),
(74, 1),
(74, 2),
(75, 1),
(75, 2),
(76, 1),
(76, 2),
(77, 1),
(77, 2),
(78, 1),
(79, 1),
(80, 1),
(81, 1),
(82, 1),
(83, 1),
(84, 1),
(85, 1),
(86, 1),
(87, 1),
(88, 6),
(88, 1),
(89, 1),
(90, 3),
(91, 3),
(92, 4),
(92, 14),
(93, 4),
(93, 14),
(94, 4),
(94, 14),
(95, 4),
(95, 14),
(96, 4),
(96, 14),
(97, 4),
(97, 14),
(98, 4),
(98, 14),
(99, 4),
(99, 14),
(100, 4),
(100, 14),
(101, 4),
(101, 14),
(102, 4),
(102, 14),
(103, 16),
(104, 5),
(105, 16),
(106, 16),
(107, 16),
(108, 16),
(110, 16),
(111, 16),
(112, 16),
(113, 16),
(114, 16),
(115, 16),
(116, 16),
(117, 16),
(118, 15),
(119, 15),
(120, 15),
(121, 15),
(122, 15),
(123, 4),
(123, 12),
(124, 4),
(124, 13),
(125, 4),
(125, 13),
(126, 4),
(126, 13),
(127, 4),
(127, 13),
(128, 4),
(128, 13),
(129, 4),
(129, 19),
(130, 8),
(130, 16),
(131, 8),
(131, 16),
(132, 8),
(132, 16),
(133, 1),
(133, 2),
(134, 8),
(135, 8),
(136, 20),
(137, 8),
(138, 3),
(139, 10),
(140, 10),
(141, 10),
(142, 10),
(143, 10),
(144, 6),
(145, 1),
(145, 2),
(146, 6),
(147, 6),
(148, 6),
(149, 6),
(150, 1),
(150, 2),
(151, 6),
(152, 6),
(153, 5),
(154, 6),
(155, 6),
(156, 7),
(156, 18),
(157, 7),
(158, 7),
(158, 18),
(159, 7),
(159, 18);

INSERT INTO collection_games (collection_id, game_id) VALUES 

-- 1. GOTY Winners
(1, 38),   -- Elden Ring
(1, 41),   -- Sekiro: Shadows Die Twice
(1, 46),   -- God of War
(1, 47),   -- God of War: Ragnarök
(1, 82),   -- Baldurs Gate 3
(1, 49),   -- Cyberpunk 2077
(1, 50),   -- The Witcher 3: Wild Hunt
(1, 92),   -- Hades
(1, 48),   -- Ghost of Tsushima
(1, 145),  -- NieR: Automata

-- 2. Indie Gems
(2, 123),  -- Hollow Knight
(2, 92),   -- Hades
(2, 124),  -- Celeste
(2, 94),   -- Vampire Survivors
(2, 96),   -- Dead Cells
(2, 95),   -- Slay the Spire
(2, 85),   -- Undertale
(2, 99),   -- Inscryption
(2, 98),   -- Enter the Gungeon
(2, 101),  -- Noita
(2, 129),  -- Terraria
(2, 127),  -- Pizza Tower

-- 3. Para jugar con amigos
(3, 8),    -- Counter-Strike 2
(3, 1),    -- Apex Legends
(3, 136),  -- Among Us
(3, 22),   -- Left 4 Dead 2
(3, 29),   -- Deep Rock Galactic
(3, 134),  -- Phasmophobia
(3, 137),  -- Lethal Company
(3, 3),    -- Fall Guys
(3, 157),  -- Rocket League
(3, 104),  -- Helldivers 2

-- 4. Soulslike & Difíciles
(4, 38),   -- Elden Ring
(4, 39),   -- Dark Souls III
(4, 40),   -- Dark Souls Remastered
(4, 41),   -- Sekiro
(4, 42),   -- Armored Core VI
(4, 43),   -- Lies of P
(4, 44),   -- Wo Long: Fallen Dynasty
(4, 45),   -- Nioh 2
(4, 123),  -- Hollow Knight
(4, 124),  -- Celeste
(4, 125),  -- Cuphead
(4, 101),  -- Noita

-- 5. Mundo Abierto
(5, 38),   -- Elden Ring
(5, 49),   -- Cyberpunk 2077
(5, 50),   -- The Witcher 3
(5, 46),   -- God of War
(5, 47),   -- God of War: Ragnarök
(5, 48),   -- Ghost of Tsushima
(5, 51),   -- Hogwarts Legacy
(5, 52),   -- Horizon Zero Dawn
(5, 77),   -- Starfield
(5, 133),  -- Dragon's Dogma 2
(5, 33),   -- Dying Light 2
(5, 105),  -- Valheim

-- 6. Terror y Supervivencia
(6, 130),  -- Resident Evil Village
(6, 131),  -- Resident Evil 4 Remake
(6, 132),  -- Resident Evil 2 Remake
(6, 134),  -- Phasmophobia
(6, 135),  -- Dead by Daylight
(6, 137),  -- Lethal Company
(6, 54),   -- Alan Wake 2
(6, 111),  -- Rust
(6, 112),  -- DayZ
(6, 106),  -- Subnautica
(6, 107),  -- The Long Dark
(6, 108),  -- Green Hell

-- 7. Shooters Competitivos
(7, 8),    -- Counter-Strike 2
(7, 1),    -- Apex Legends
(7, 31),   -- Rainbow Six Siege
(7, 18),   -- Doom Eternal
(7, 19),   -- Doom 2016
(7, 30),   -- Hunt: Showdown
(7, 15),   -- Battlebit Remastered
(7, 21),   -- Deathloop
(7, 104),  -- Helldivers 2
(7, 153),  -- Warhammer 40K: Space Marine 2

-- 8. Narrativa e Historia
(8, 50),   -- The Witcher 3
(8, 82),   -- Baldurs Gate 3
(8, 84),   -- Disco Elysium
(8, 49),   -- Cyberpunk 2077
(8, 54),   -- Alan Wake 2
(8, 55),   -- A Plague Tale: Requiem
(8, 56),   -- A Plague Tale: Innocence
(8, 59),   -- Detroit: Become Human
(8, 60),   -- Death Stranding
(8, 65),   -- Mass Effect: Legendary Edition
(8, 145),  -- NieR: Automata
(8, 85),   -- Undertale

-- 9. Roguelikes Adictivos
(9, 92),   -- Hades
(9, 93),   -- Hades II
(9, 94),   -- Vampire Survivors
(9, 95),   -- Slay the Spire
(9, 96),   -- Dead Cells
(9, 97),   -- Binding of Isaac: Repentance
(9, 98),   -- Enter the Gungeon
(9, 99),   -- Inscryption
(9, 100),  -- Monster Train
(9, 101),  -- Noita
(9, 61),   -- Returnal

-- 10. JRPGs y RPGs épicos
(10, 78),  -- Persona 5 Royal
(10, 79),  -- Persona 4 Golden
(10, 80),  -- Like a Dragon: Infinite Wealth
(10, 81),  -- Yakuza: Like a Dragon
(10, 82),  -- Baldurs Gate 3
(10, 83),  -- Divinity: Original Sin 2
(10, 87),  -- Octopath Traveler II
(10, 89),  -- Sea of Stars
(10, 145), -- NieR: Automata
(10, 150), -- NieR Replicant
(10, 65),  -- Mass Effect: Legendary Edition
(10, 50),  -- The Witcher 3

-- 11. Free to Play
(11, 1),   -- Apex Legends
(11, 8),   -- Counter-Strike 2 (F2P)
(11, 3),   -- Fall Guys
(11, 9),   -- Team Fortress 2
(11, 70),  -- Warframe
(11, 71),  -- Path of Exile
(11, 74),  -- Dauntless
(11, 94),  -- Vampire Survivors
(11, 135), -- Dead by Daylight (F2P base)
(11, 142), -- Brawlhalla
(11, 157), -- Rocket League
(11, 136), -- Among Us

-- 12. Cooperativo Imprescindible
(12, 22),  -- Left 4 Dead 2
(12, 29),  -- Deep Rock Galactic
(12, 104), -- Helldivers 2
(12, 6),   -- Warhammer 40K: Darktide
(12, 153), -- Warhammer 40K: Space Marine 2
(12, 26),  -- Back 4 Blood
(12, 25),  -- Killing Floor 2
(12, 116), -- Don't Starve Together
(12, 105), -- Valheim
(12, 82),  -- Baldurs Gate 3
(12, 83),  -- Divinity: Original Sin 2
(12, 134), -- Phasmophobia

-- 13. Estrategia y Gestión
(13, 144), -- Civilization VI
(13, 146), -- Total War: Warhammer III
(13, 147), -- Age of Empires IV
(13, 148), -- Crusader Kings III
(13, 149), -- Europa Universalis IV
(13, 151), -- Stellaris
(13, 152), -- Hearts of Iron IV
(13, 154), -- XCOM 2
(13, 119), -- Factorio
(13, 120), -- RimWorld
(13, 122), -- Cities: Skylines
(13, 155); -- Darkest Dungeon 2

INSERT INTO messages (sender_id, receiver_id, content, recommended_game_id) VALUES 
(1, 2, '¡Hey! Tienes que probar esto, es una obra maestra.', NULL),
(1, 2, 'Mira, es difícil pero vale la pena.', 38),
(2, 1, 'Uff, se ve demasiado estresante para mí ahora mismo...', NULL),
(2, 1, 'Yo estoy viciado a esto, es pura paz.', 121);

INSERT INTO user_games (user_id, game_id, status, is_priority, is_finished) VALUES 
(1, 38, 'LIKED', 1, 0),     -- Elden Ring
(1, 41, 'LIKED', 1, 0),     -- Sekiro
(1, 92, 'LIKED', 0, 0),     -- Hades
(1, 123, 'LIKED', 0, 0),    -- Hollow Knight
(1, 18, 'LIKED', 1, 0),     -- Doom Eternal
(1, 82, 'LIKED', 0, 0),     -- Baldurs Gate 3
(1, 49, 'LIKED', 0, 0),     -- Cyberpunk 2077
(1, 121, 'DISLIKED', 0, 0), -- Stardew Valley
(1, 136, 'DISLIKED', 0, 0), -- Among Us

(2, 121, 'LIKED', 1, 0),    -- Stardew Valley
(2, 136, 'LIKED', 1, 0),    -- Among Us
(2, 123, 'COMPLETED', 0, 1),-- Hollow Knight
(2, 92, 'LIKED', 0, 0),     -- Hades
(2, 3, 'LIKED', 0, 0),      -- Fall Guys

(3, 8, 'LIKED', 1, 0),      -- Counter-Strike 2
(3, 1, 'LIKED', 1, 0),      -- Apex Legends
(3, 16, 'LIKED', 1, 0),     -- Rogue Company
(3, 38, 'DROPPED', 0, 0);   -- Elden Ring

INSERT INTO friendships (user_id_1, user_id_2, status) VALUES 
(1, 2, 'ACCEPTED'), 
(1, 3, 'ACCEPTED'), 
(3, 7, 'ACCEPTED'), 
(2, 6, 'ACCEPTED'), 
(4, 1, 'PENDING'),  
(8, 2, 'PENDING'),  
(5, 1, 'PENDING'),  
(6, 5, 'BLOCKED');  

INSERT INTO user_platforms (user_id, platform_id) VALUES
(1, 1), (1, 2),
(2, 1), (2, 5),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1), (8, 5),
(9, 1), (9, 2),
(10, 1),
(14, 5),
(15, 1);