import neo4j, { Driver, Session } from 'neo4j-driver';

let driver: Driver | null = null;

export const initDriver = () => {
  if (!driver) {
    driver = neo4j.driver(
      import.meta.env.VITE_NEO4J_URI,
      neo4j.auth.basic(
        import.meta.env.VITE_NEO4J_USER,
        import.meta.env.VITE_NEO4J_PASSWORD
      ),
      { disableLosslessIntegers: true } 
    );
  }
  return driver;
};

export const readQuery = async (cypher: string, params = {}) => {
  const driver = initDriver();
  const session = driver.session();

  try {
    const result = await session.run(cypher, params);
    return result.records.map((record) => {
      return record.toObject();
    });
  } catch (error) {
    console.error('Neo4j Read Error:', error);
    throw error;
  } finally {
    await session.close();
  }
};

export const writeQuery = async (cypher: string, params = {}) => {
  const driver = initDriver();
  const session = driver.session();

  try {
    const result = await session.executeWrite((tx) => tx.run(cypher, params));
    return result.records.map((record) => record.toObject());
  } catch (error) {
    console.error('Neo4j Write Error:', error);
    throw error;
  } finally {
    await session.close();
  }
};