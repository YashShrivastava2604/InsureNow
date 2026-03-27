from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# load knowledge
with open("data/insurance_knowledge.txt", "r") as f:
    text = f.read()

chunks = text.split("\n")

# embedding model
model = SentenceTransformer("BAAI/bge-base-en-v1.5")

embeddings = model.encode(chunks)

dimension = embeddings.shape[1]

index = faiss.IndexFlatL2(dimension)
index.add(np.array(embeddings))

faiss.write_index(index, "rag/vector_store.faiss")

# save chunks
import pickle
with open("rag/chunks.pkl", "wb") as f:
    pickle.dump(chunks, f)

print("Vector DB created")