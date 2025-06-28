// Test queries simples
const database = require('./src/config/database');

async function testQueries() {
  try {
    await database.initialize();
    console.log('✅ Database connected');

    // Test 1: Simple select
    console.log('\n1️⃣ Testing simple SELECT...');
    try {
      const [rows] = await database.query('SELECT * FROM vf_competencias_catalogo LIMIT 3');
      console.log('✅ Simple SELECT works:', rows.length, 'rows');
    } catch (error) {
      console.log('❌ Simple SELECT failed:', error.message);
    }

    // Test 2: With WHERE clause
    console.log('\n2️⃣ Testing WHERE with activo...');
    try {
      const [rows] = await database.query('SELECT * FROM vf_competencias_catalogo WHERE activo = ? LIMIT 3', [1]);
      console.log('✅ WHERE with activo works:', rows.length, 'rows');
    } catch (error) {
      console.log('❌ WHERE with activo failed:', error.message);
    }

    // Test 3: With COUNT(*) OVER()
    console.log('\n3️⃣ Testing COUNT(*) OVER()...');
    try {
      const [rows] = await database.query('SELECT *, COUNT(*) OVER() as total_count FROM vf_competencias_catalogo LIMIT 3');
      console.log('✅ COUNT(*) OVER() works:', rows.length, 'rows');
    } catch (error) {
      console.log('❌ COUNT(*) OVER() failed:', error.message);
    }

    // Test 4: Combined query
    console.log('\n4️⃣ Testing combined query...');
    try {
      const [rows] = await database.query(`
        SELECT *, COUNT(*) OVER() as total_count 
        FROM vf_competencias_catalogo 
        WHERE activo = ? 
        ORDER BY categoria, nombre 
        LIMIT ? OFFSET ?
      `, [1, 50, 0]);
      console.log('✅ Combined query works:', rows.length, 'rows');
    } catch (error) {
      console.log('❌ Combined query failed:', error.message);
    }

    // Test 5: Check table structure
    console.log('\n5️⃣ Checking table structure...');
    try {
      const [rows] = await database.query('DESCRIBE vf_competencias_catalogo');
      console.log('✅ Table structure:');
      rows.forEach(col => {
        console.log(`   ${col.Field}: ${col.Type} (${col.Null === 'YES' ? 'NULL' : 'NOT NULL'})`);
      });
    } catch (error) {
      console.log('❌ DESCRIBE failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await database.close();
    process.exit(0);
  }
}

testQueries();